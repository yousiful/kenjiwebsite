import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingCart, Zap, Star, Award, Gift } from 'lucide-react';

// Mock user data for notifications
const firstNames = [
  'Sarah', 'John', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'James',
  'Ava', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander',
  'Amelia', 'Daniel', 'Harper', 'Matthew', 'Evelyn', 'Joseph', 'Abigail', 'David',
  'Emily', 'Andrew', 'Elizabeth', 'Joshua', 'Sofia', 'Christopher', 'Avery', 'Jack',
  'Ella', 'Ryan', 'Madison', 'Nathan', 'Scarlett', 'Samuel', 'Victoria', 'Tyler',
  'Grace', 'Christian', 'Chloe', 'Noah', 'Lily', 'Anthony', 'Hannah', 'Jonathan',
  'Zoe', 'Nicholas', 'Layla', 'Brandon', 'Natalie', 'Gabriel', 'Leah', 'Austin',
  'Audrey', 'Kevin', 'Savannah', 'Thomas', 'Brooklyn', 'Jose', 'Bella', 'Jason',
  'Claire', 'Timothy', 'Skylar', 'Adam', 'Lucy', 'Caleb', 'Anna', 'Jordan',
  'Aaliyah', 'Zachary', 'Gabriella', 'Isaac', 'Kaylee', 'Luke', 'Nevaeh', 'Isaiah',
  'Allison', 'Blake', 'Alexis', 'Justin', 'Ashley', 'Sean', 'Samantha', 'Charles',
  'Brianna', 'Stephen', 'Sarah', 'Juan', 'Zoe', 'Aaron', 'Hailey', 'Patrick',
  'Kaitlyn', 'Connor', 'Gabrielle', 'Jeremiah', 'Ellie', 'Cameron', 'Alyssa', 'Kyle'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
  'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
  'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez',
  'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter',
  'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans',
  'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook',
  'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox',
  'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson',
  'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross',
  'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes',
  'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander',
  'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan'
];

const locations = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle',
  'Denver', 'Washington DC', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Portland',
  'Memphis', 'Oklahoma City', 'Las Vegas', 'Louisville', 'Baltimore', 'Milwaukee',
  'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Mesa', 'Atlanta', 'Kansas City',
  'Colorado Springs', 'Miami', 'Raleigh', 'Omaha', 'Long Beach', 'Virginia Beach',
  'Oakland', 'Minneapolis', 'Tampa', 'Tulsa', 'Arlington', 'New Orleans', 'London',
  'Toronto', 'Sydney', 'Singapore', 'Tokyo', 'Berlin', 'Paris', 'Amsterdam',
  'Dubai', 'Barcelona', 'Rome', 'Hong Kong', 'Seoul', 'Mumbai', 'Bangkok'
];

const tools = [
  'AI Prompt Generator',
  'PR Pro',
  'Sales Coach',
  'Investor Connect',
  'Voice AI',
  'Smart Analytics',
  'AI Website Builder',
  'Smart Chatbots',
  'Social Media Planner'
];

const generateRandomUser = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  return {
    name: `${firstName} ${lastName.charAt(0)}.`,
    location
  };
};

const generateRandomActivity = () => {
  const activities = [
    {
      type: 'signup',
      icon: Users,
      message: (user: { name: string, location: string }) => 
        `${user.name} from ${user.location} just signed up`,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      type: 'purchase',
      icon: ShoppingCart,
      message: (user: { name: string, location: string }) => 
        `${user.name} from ${user.location} just purchased KenjiAI`,
      color: 'from-green-400 to-emerald-400'
    },
    {
      type: 'tool',
      icon: Zap,
      message: (user: { name: string, location: string }) => {
        const tool = tools[Math.floor(Math.random() * tools.length)];
        return `${user.name} is using ${tool} right now`;
      },
      color: 'from-purple-400 to-pink-400'
    },
    {
      type: 'review',
      icon: Star,
      message: (user: { name: string, location: string }) => {
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
        return `${user.name} just gave KenjiAI ${rating} stars`;
      },
      color: 'from-yellow-400 to-orange-400'
    },
    {
      type: 'achievement',
      icon: Award,
      message: (user: { name: string, location: string }) => {
        const achievements = ['$10K in revenue', '100 leads generated', '50% conversion rate', 'first AI sale'];
        const achievement = achievements[Math.floor(Math.random() * achievements.length)];
        return `${user.name} achieved ${achievement} with KenjiAI`;
      },
      color: 'from-pink-400 to-rose-400'
    },
    {
      type: 'discount',
      icon: Gift,
      message: (user: { name: string, location: string }) => 
        `${user.name} just claimed their 10% discount`,
      color: 'from-indigo-400 to-purple-400'
    }
  ];

  const activity = activities[Math.floor(Math.random() * activities.length)];
  const user = generateRandomUser();
  
  return {
    id: Math.random().toString(36).substring(2, 11),
    type: activity.type,
    icon: activity.icon,
    message: activity.message(user),
    color: activity.color,
    timestamp: new Date()
  };
};

const UserActivityNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentNotification, setCurrentNotification] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate initial notifications
    const initialNotifications = Array(10).fill(null).map(() => generateRandomActivity());
    setNotifications(initialNotifications);
    
    // Show first notification after a short delay
    setTimeout(() => {
      setCurrentNotification(initialNotifications[0]);
      setIsVisible(true);
    }, 3000);
    
    // Set up interval to show notifications
    const interval = setInterval(() => {
      // Generate new notification
      const newNotification = generateRandomActivity();
      setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
      
      // Show notification
      setCurrentNotification(newNotification);
      setIsVisible(true);
      
      // Hide notification after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    }, 15000); // Show a new notification every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -100, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
            className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-2.5 shadow-xl max-w-[260px]"
          >
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 bg-gradient-to-br ${currentNotification.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                <currentNotification.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[10px] leading-tight truncate">{currentNotification.message}</p>
                <p className="text-gray-400 text-[9px] mt-0.5">Just now</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserActivityNotifications;