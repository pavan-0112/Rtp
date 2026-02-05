
import { AnimatedDiv } from '@/components/ui/animated-components';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessageProps {
  message: {
    id: string;
    message: string;
    sender_role: string;
    created_at: string;
    sender_name: string;
  };
  index: number;
}

export const ChatMessage = ({ message, index }: ChatMessageProps) => {
  const { user } = useAuth();
  const isOwnMessage = message.sender_role === user?.role;
  const isSystemMessage = message.sender_role === 'system';

  return (
    <AnimatedDiv
      className={`flex ${isSystemMessage ? 'justify-center' : isOwnMessage ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
          isSystemMessage
            ? 'bg-gray-100 text-gray-600 mx-auto'
            : isOwnMessage
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.message}</p>
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${
            isSystemMessage
              ? 'text-gray-500'
              : isOwnMessage 
              ? 'text-blue-100' 
              : 'text-gray-500'
          }`}>
            {message.sender_name}
          </p>
          <p className={`text-xs ${
            isSystemMessage
              ? 'text-gray-500'
              : isOwnMessage 
              ? 'text-blue-100' 
              : 'text-gray-500'
          }`}>
            {new Date(message.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </AnimatedDiv>
  );
};
