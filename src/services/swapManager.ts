import { createShift, getShiftStatus, getSwapQuote, SwapQuote } from './sideshift';
import { getTokenBySymbol, SUPPORTED_TOKENS } from './sideshift';
import { supabase } from '../lib/supabase';

export interface SwapRequest {
  userId: string;
  fromToken: string;
  toToken: string;
  amount: number;
  walletAddress: string;
  strategyType: 'safe' | 'balanced' | 'aggressive';
}

export interface SwapResult {
  success: boolean;
  shiftId?: string;
  quote?: SwapQuote;
  depositAddress?: string;
  error?: string;
  transactionHash?: string;
}

class SwapManager {
  async getSwapQuote(fromToken: string, toToken: string, amount: number): Promise<SwapQuote> {
    const fromTokenInfo = getTokenBySymbol(fromToken);
    const toTokenInfo = getTokenBySymbol(toToken);

    if (!fromTokenInfo || !toTokenInfo) {
      throw new Error(`Unsupported token: ${!fromTokenInfo ? fromToken : toToken}`);
    }

    const amountInSmallestUnit = this.formatAmount(amount, fromTokenInfo.decimals);

    return getSwapQuote(
      fromTokenInfo.sideshift,
      toTokenInfo.sideshift,
      amountInSmallestUnit
    );
  }

  async initiateSwap(request: SwapRequest): Promise<SwapResult> {
    try {
      const fromTokenInfo = getTokenBySymbol(request.fromToken);
      const toTokenInfo = getTokenBySymbol(request.toToken);

      if (!fromTokenInfo || !toTokenInfo) {
        return {
          success: false,
          error: `Unsupported token pair: ${request.fromToken} → ${request.toToken}`,
        };
      }

      const amountInSmallestUnit = this.formatAmount(request.amount, fromTokenInfo.decimals);

      const quote = await getSwapQuote(
        fromTokenInfo.sideshift,
        toTokenInfo.sideshift,
        amountInSmallestUnit
      );

      const order = await createShift(
        fromTokenInfo.sideshift,
        toTokenInfo.sideshift,
        request.walletAddress,
        amountInSmallestUnit
      );

      await this.recordSwapTransaction({
        userId: request.userId,
        shiftId: order.id,
        fromToken: request.fromToken,
        toToken: request.toToken,
        fromAmount: request.amount,
        toAmount: this.formatAmountBack(order.settleAmount, toTokenInfo.decimals),
        settleAddress: request.walletAddress,
        rate: parseFloat(order.rate),
        strategyType: request.strategyType,
      });

      return {
        success: true,
        shiftId: order.id,
        depositAddress: order.depositAddress,
        quote,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async checkSwapStatus(shiftId: string, userId: string): Promise<{
    status: string;
    completed: boolean;
    settleAmount?: number;
    error?: string;
  }> {
    try {
      const order = await getShiftStatus(shiftId);

      const isCompleted = order.status === 'complete';

      if (isCompleted) {
        const toTokenInfo = getTokenBySymbol(
          this.getTokenSymbolFromSideshift(order.settleCoin)
        );
        const settleAmount = toTokenInfo
          ? this.formatAmountBack(order.settleAmount, toTokenInfo.decimals)
          : parseFloat(order.settleAmount);

        await this.updateSwapTransaction(shiftId, {
          status: 'completed',
          to_amount: settleAmount,
        });
      } else if (order.status === 'error' || order.status === 'failed') {
        await this.updateSwapTransaction(shiftId, {
          status: 'failed',
          error_message: 'Swap failed on SideShift',
        });
      }

      return {
        status: order.status,
        completed: isCompleted,
        settleAmount: parseFloat(order.settleAmount),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'error',
        completed: false,
        error: errorMessage,
      };
    }
  }

  private async recordSwapTransaction(data: {
    userId: string;
    shiftId: string;
    fromToken: string;
    toToken: string;
    fromAmount: number;
    toAmount: number;
    settleAddress: string;
    rate: number;
    strategyType: string;
  }) {
    const { error } = await supabase.from('swap_transactions').insert({
      user_id: data.userId,
      shift_id: data.shiftId,
      from_token: data.fromToken.toLowerCase(),
      to_token: data.toToken.toLowerCase(),
      from_amount: data.fromAmount,
      to_amount: data.toAmount,
      from_chain: 'polygon',
      to_chain: 'polygon',
      settle_address: data.settleAddress,
      rate: data.rate,
      status: 'pending',
      strategy_type: data.strategyType,
    });

    if (error) {
      console.error('Failed to record swap transaction:', error);
      throw error;
    }
  }

  private async updateSwapTransaction(
    shiftId: string,
    updates: Record<string, unknown>
  ) {
    const { error } = await supabase
      .from('swap_transactions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('shift_id', shiftId);

    if (error) {
      console.error('Failed to update swap transaction:', error);
    }
  }

  private formatAmount(amount: number, decimals: number): string {
    return (amount * Math.pow(10, decimals)).toFixed(0);
  }

  private formatAmountBack(amount: string, decimals: number): number {
    return parseFloat(amount) / Math.pow(10, decimals);
  }

  private getTokenSymbolFromSideshift(sideshiftCode: string): string {
    const token = SUPPORTED_TOKENS.find(t => t.sideshift === sideshiftCode);
    return token ? token.symbol : sideshiftCode;
  }

  async validateSwapPair(fromToken: string, toToken: string): Promise<{
    valid: boolean;
    minAmount?: number;
    maxAmount?: number;
    error?: string;
  }> {
    try {
      const fromTokenInfo = getTokenBySymbol(fromToken);
      const toTokenInfo = getTokenBySymbol(toToken);

      if (!fromTokenInfo || !toTokenInfo) {
        return {
          valid: false,
          error: 'One or both tokens are not supported',
        };
      }

      const quote = await getSwapQuote(
        fromTokenInfo.sideshift,
        toTokenInfo.sideshift,
        this.formatAmount(0.1, fromTokenInfo.decimals)
      );

      return {
        valid: true,
        minAmount: this.formatAmountBack(quote.minDeposit, fromTokenInfo.decimals),
        maxAmount: this.formatAmountBack(quote.maxDeposit, fromTokenInfo.decimals),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        valid: false,
        error: errorMessage,
      };
    }
  }

  async getSwapHistory(walletAddress: string, limit: number = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('swap_history')
      .select('*')
      .eq('user_address', walletAddress)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch swap history:', error);
      return [];
    }

    return data || [];
  }
}

export const swapManager = new SwapManager();
