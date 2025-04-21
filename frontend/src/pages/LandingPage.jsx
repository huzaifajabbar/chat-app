import React from 'react';
import { 
  MessageCircle, 
  Users, 
  Shield, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      icon: <MessageCircle className="w-12 h-12 text-primary" />,
      title: "Instant Messaging",
      description: "Connect with friends and colleagues in real-time"
    },
    {
      icon: <Users className="w-12 h-12 text-secondary" />,
      title: "Seamless Connections",
      description: "Build and maintain relationships effortlessly"
    },
    {
      icon: <Shield className="w-12 h-12 text-accent" />,
      title: "Secure Communication",
      description: "Your privacy and security are our top priorities"
    }
  ];

  return (
    <div className="min-h-screen bg-base-100 flex flex-col relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col justify-center">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-base-content transform transition-all duration-500 hover:scale-105">
              Connect, Chat, <br /> Communicate Freely
            </h1>
            <p className="text-xl text-base-content max-w-md mx-auto md:mx-0 mb-8">
              Join our platform and start connecting with people around the world
            </p>
            
            <div className="flex justify-center md:justify-start space-x-4">
              <Link 
                to="/signup" 
                className="
                  btn btn-primary
                  flex 
                  items-center 
                  space-x-2
                  hover:scale-105 
                  transition-transform 
                  duration-300
                "
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="
                  bg-base-200 
                  p-6 
                  rounded-xl 
                  shadow-lg 
                  flex 
                  items-center 
                  space-x-4
                  hover:scale-105
                  hover:shadow-xl
                  transition-all
                  duration-300
                  group
                "
              >
                <div className="p-3 bg-base-100 rounded-full shadow-md">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-base-content group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-base-content">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10 -z-10">
        <div className="absolute bg-primary rounded-full -top-20 -right-20 w-96 h-96 blur-3xl" />
        <div className="absolute bg-secondary rounded-full -bottom-20 -left-20 w-96 h-96 blur-3xl" />
      </div>
    </div>
  );
};

export default LandingPage;
