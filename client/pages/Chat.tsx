import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Heart,
  Package,
  HeadphonesIcon,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "order";
  orderData?: {
    id: number;
    total: number;
    items: number;
  };
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  type: "vendor" | "donator" | "support";
  lastMessageStatus: "sent" | "delivered" | "read";
}

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "👩‍⚕️",
      lastMessage: "Votre commande est prête pour la livraison",
      timestamp: "14:30",
      unreadCount: 2,
      isOnline: true,
      type: "vendor",
      lastMessageStatus: "delivered",
    },
    {
      id: 2,
      name: "Marie Dubois",
      avatar: "❤️",
      lastMessage: "J'ai payé votre commande. Bon appétit!",
      timestamp: "12:15",
      unreadCount: 0,
      isOnline: false,
      type: "donator",
      lastMessageStatus: "read",
    },
    {
      id: 3,
      name: "Support TeleHiba",
      avatar: "🎧",
      lastMessage: "Comment puis-je vous aider aujourd'hui?",
      timestamp: "Hier",
      unreadCount: 0,
      isOnline: true,
      type: "support",
      lastMessageStatus: "read",
    },
    {
      id: 4,
      name: "Dr. Michael Chen",
      avatar: "👨‍⚕️",
      lastMessage: "Merci pour votre commande!",
      timestamp: "Hier",
      unreadCount: 1,
      isOnline: false,
      type: "vendor",
      lastMessageStatus: "sent",
    },
  ];

  const messages: Record<number, Message[]> = {
    1: [
      {
        id: 1,
        text: "Bonjour! Votre commande de tomates et pommes est prête.",
        timestamp: "14:25",
        isMe: false,
        status: "read",
        type: "text",
      },
      {
        id: 2,
        text: "Parfait! À quelle heure puis-je venir récupérer?",
        timestamp: "14:27",
        isMe: true,
        status: "read",
        type: "text",
      },
      {
        id: 3,
        text: "Votre commande est prête pour la livraison",
        timestamp: "14:30",
        isMe: false,
        status: "delivered",
        type: "text",
      },
    ],
    2: [
      {
        id: 1,
        text: "Bonjour! J'ai vu votre commande en attente.",
        timestamp: "12:10",
        isMe: false,
        status: "read",
        type: "text",
      },
      {
        id: 2,
        text: "Merci beaucoup! C'est très gentil de votre part.",
        timestamp: "12:12",
        isMe: true,
        status: "read",
        type: "text",
      },
      {
        id: 3,
        text: "J'ai payé votre commande. Bon appétit!",
        timestamp: "12:15",
        isMe: false,
        status: "read",
        type: "text",
      },
    ],
    3: [
      {
        id: 1,
        text: "Bonjour! Comment puis-je vous aider aujourd'hui?",
        timestamp: "10:00",
        isMe: false,
        status: "read",
        type: "text",
      },
    ],
  };

  const getTypeIcon = (type: Conversation["type"]) => {
    switch (type) {
      case "vendor":
        return <Package className="w-3 h-3" />;
      case "donator":
        return <Heart className="w-3 h-3" />;
      case "support":
        return <HeadphonesIcon className="w-3 h-3" />;
      default:
        return <MessageCircle className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: Conversation["type"]) => {
    switch (type) {
      case "vendor":
        return "text-app-purple bg-app-purple/10";
      case "donator":
        return "text-pink-500 bg-pink-100";
      case "support":
        return "text-blue-500 bg-blue-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-app-purple" />;
      default:
        return null;
    }
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    // Simulate sending message
    console.log("Sending message:", messageText);
    setMessageText("");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedChat,
  );
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Chat Header */}
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedChat(null)}
              className="text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
                  {selectedConversation?.avatar}
                </div>
                {selectedConversation?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  {selectedConversation?.name}
                </h2>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${selectedConversation?.isOnline ? "bg-green-400" : "bg-gray-400"}`}
                  ></div>
                  <span className="text-xs text-white/80">
                    {selectedConversation?.isOnline ? "En ligne" : "Hors ligne"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isMe
                    ? "bg-app-purple text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div
                  className={`flex items-center gap-1 mt-1 ${
                    message.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`text-xs ${message.isMe ? "text-white/70" : "text-gray-500"}`}
                  >
                    {message.timestamp}
                  </span>
                  {message.isMe && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Tapez votre message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!messageText.trim()}
              className="bg-app-purple text-white p-2 rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">Messages</h1>
            <p className="text-sm text-white/80">
              {conversations.length} conversations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications">
            <Bell className="w-6 h-6 text-white hover:text-white/80 transition-colors" />
          </Link>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat Filters */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          <button className="flex items-center gap-2 px-3 py-2 bg-app-purple text-white rounded-full text-sm font-medium whitespace-nowrap">
            <MessageCircle className="w-4 h-4" />
            Tous
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            <Package className="w-4 h-4" />
            Vendeurs
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            <Heart className="w-4 h-4" />
            Donateurs
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            <HeadphonesIcon className="w-4 h-4" />
            Support
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="pb-20">
        {filteredConversations.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 px-4">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aucune conversation trouvée</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center text-lg">
                      {conversation.avatar}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {conversation.name}
                      </h3>
                      <div
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${getTypeColor(conversation.type)}`}
                      >
                        {getTypeIcon(conversation.type)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(conversation.lastMessageStatus)}
                      {conversation.unreadCount > 0 && (
                        <div className="w-2 h-2 bg-app-purple rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
