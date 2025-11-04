import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'swap_executed' | 'swap_failed' | 'price_alert' | 'profit_milestone' | 'ai_signal' | 'warning' | 'info';
  status: 'unread' | 'read' | 'archived';
  created_at: string;
  read_at?: string;
  related_data?: Record<string, unknown>;
}

class NotificationService {
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: Notification['type'],
    relatedData?: Record<string, unknown>
  ): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('alerts_notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          status: 'unread',
          related_data: relatedData || {},
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create notification:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Notification creation error:', error);
      return null;
    }
  }

  async getNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('alerts_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('alerts_notifications')
        .update({
          status: 'read',
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Failed to mark notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Mark as read error:', error);
      return false;
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('alerts_notifications')
        .update({
          status: 'read',
          read_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('status', 'unread');

      if (error) {
        console.error('Failed to mark all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Mark all as read error:', error);
      return false;
    }
  }

  async archiveNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('alerts_notifications')
        .update({ status: 'archived' })
        .eq('id', notificationId);

      if (error) {
        console.error('Failed to archive notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Archive notification error:', error);
      return false;
    }
  }

  async notifySwapExecuted(
    userId: string,
    fromToken: string,
    toToken: string,
    fromAmount: number,
    toAmount: number,
    profitLoss: number
  ): Promise<void> {
    const title = `Swap Executed: ${fromToken} → ${toToken}`;
    const message = `Successfully swapped ${fromAmount.toFixed(4)} ${fromToken} for ${toAmount.toFixed(4)} ${toToken}`;

    await this.createNotification(userId, title, message, 'swap_executed', {
      from_token: fromToken,
      to_token: toToken,
      from_amount: fromAmount,
      to_amount: toAmount,
      profit_loss: profitLoss,
    });
  }

  async notifySwapFailed(
    userId: string,
    fromToken: string,
    toToken: string,
    reason: string
  ): Promise<void> {
    const title = `Swap Failed: ${fromToken} → ${toToken}`;
    const message = `The swap failed. Reason: ${reason}`;

    await this.createNotification(userId, title, message, 'swap_failed', {
      from_token: fromToken,
      to_token: toToken,
      reason,
    });
  }

  async notifyAISignal(
    userId: string,
    action: string,
    fromToken: string,
    toToken: string,
    confidence: number,
    reason: string
  ): Promise<void> {
    const title = `AI Signal: ${action.toUpperCase()}`;
    const message = `AI detected ${action} opportunity for ${fromToken} → ${toToken} (${(confidence * 100).toFixed(0)}% confidence)`;

    await this.createNotification(userId, title, message, 'ai_signal', {
      action,
      from_token: fromToken,
      to_token: toToken,
      confidence,
      reason,
    });
  }

  async notifyPriceAlert(
    userId: string,
    token: string,
    currentPrice: number,
    targetPrice: number,
    direction: 'above' | 'below'
  ): Promise<void> {
    const title = `Price Alert: ${token}`;
    const message = `${token} price went ${direction} ${targetPrice}. Current: $${currentPrice.toLocaleString()}`;

    await this.createNotification(userId, title, message, 'price_alert', {
      token,
      current_price: currentPrice,
      target_price: targetPrice,
      direction,
    });
  }

  async notifyProfitMilestone(
    userId: string,
    milestone: number,
    currentProfit: number
  ): Promise<void> {
    const title = `Milestone: +$${milestone}`;
    const message = `Congratulations! You've reached a ${milestone} profit milestone. Total: +$${currentProfit.toLocaleString()}`;

    await this.createNotification(userId, title, message, 'profit_milestone', {
      milestone,
      total_profit: currentProfit,
    });
  }
}

export const notificationService = new NotificationService();
