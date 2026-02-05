
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { AnimatedDiv, fadeInUp, scaleIn } from '@/components/ui/animated-components';
import { ChatMessage } from './ChatMessage';
import { EmptyState } from '../layout/EmptyState';

interface Message {
  id: string;
  message: string;
  sender_role: string;
  created_at: string;
  sender_name: string;
}

interface MaintenanceChatProps {
  selectedRequestId: string;
  onClose: () => void;
}

export const MaintenanceChat = ({ selectedRequestId, onClose }: MaintenanceChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with a welcome message
  useEffect(() => {
    if (selectedRequestId) {
      const welcomeMessage: Message = {
        id: '1',
        message: 'Chat started for this maintenance request. You can communicate with the other party here.',
        sender_role: 'system',
        created_at: new Date().toISOString(),
        sender_name: 'System'
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedRequestId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRequestId || !user || isLoading) return;

    setIsLoading(true);
    try {
      const messageObj: Message = {
        id: Date.now().toString(),
        message: newMessage.trim(),
        sender_role: user.role || 'user',
        created_at: new Date().toISOString(),
        sender_name: user.name || user.email || 'User'
      };

      setMessages(prev => [...prev, messageObj]);
      setNewMessage('');
      
      toast.success('Message sent!');
      
      // Simulate a response after a delay (for demo purposes)
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          message: 'Thank you for your message. We will respond shortly.',
          sender_role: user.role === 'tenant' ? 'landlord' : 'tenant',
          created_at: new Date().toISOString(),
          sender_name: user.role === 'tenant' ? 'Landlord' : 'Tenant'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatedDiv {...scaleIn}>
      <Card className="border-0 shadow-xl h-[500px] flex flex-col bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">Maintenance Chat</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-white/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
            {messages.length === 0 ? (
              <EmptyState
                icon={<MessageCircle className="h-12 w-12 text-gray-300" />}
                title="No messages yet"
                description="Start the conversation!"
              />
            ) : (
              messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  index={index}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || isLoading}
                className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedDiv>
  );
};
