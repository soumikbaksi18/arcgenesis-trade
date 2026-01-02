import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAuthenticated, logout, login } from '../auth/localAuth';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTradingHovered, setIsTradingHovered] = useState(false);
  const [isTradingMobileOpen, setIsTradingMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on mount and location change
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [location.pathname]);

  const handleLogin = () => {
    login();
    setIsLoggedIn(true);
    navigate('/app');
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/markets', label: 'Markets' },
    { path: '/strategies', label: 'Strategies' },
    { path: '/trading', label: 'Trading', hasDropdown: true },
  ];

  const tradingTypes = [
    { path: '/trading/perps', label: 'Perps/Futures' },
    { path: '/trading/spot', label: 'Spot' },
    { path: '/trading/options', label: 'Options' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-roboto text-lg font-light text-white/90 tracking-wide">
              ArcGenesis
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.path}
                    className="relative"
                    onMouseEnter={() => setIsTradingHovered(true)}
                    onMouseLeave={() => setIsTradingHovered(false)}
                  >
                    <Link
                      to={link.path}
                      className="text-sm font-roboto font-light tracking-wide relative flex items-center gap-1.5 py-2 px-1"
                    >
                      <motion.span
                        className={`block ${
                          isActive(link.path)
                            ? 'text-white'
                            : 'text-white/50 hover:text-white/80'
                        }`}
                        animate={{
                          color: isActive(link.path) ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)',
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.label}
                      </motion.span>
                      <ChevronDown 
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isTradingHovered ? 'rotate-180' : ''
                        } ${isActive(link.path) ? 'text-white' : 'text-white/50'}`}
                      />
                      {isActive(link.path) && (
                        <motion.span
                          layoutId={`navbar-underline-${link.path}`}
                          className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isTradingHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-4 flex flex-col space-y-1 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg p-2 min-w-[160px] z-[300]"
                        >
                          {tradingTypes.map((type) => (
                            <Link
                              key={type.path}
                              to={type.path}
                              className={`text-sm font-roboto font-light tracking-wide transition-colors duration-200 whitespace-nowrap ${
                                isActive(type.path)
                                  ? 'text-white'
                                  : 'text-white/50 hover:text-white/80'
                              }`}
                            >
                              {type.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-roboto font-light tracking-wide relative py-2 px-1"
                >
                  <motion.span
                    className={`block ${
                      isActive(link.path)
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                    animate={{
                      color: isActive(link.path) ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.span>
                  {isActive(link.path) && (
                    <motion.span
                      layoutId={`navbar-underline-${link.path}`}
                      className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Login/Signup OR App/Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-6">
              {!isLoggedIn ? (
                <>
                  <button 
                    onClick={handleLogin}
                    className="font-roboto font-light text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button 
                    onClick={handleLogin}
                    className="launch-app-button font-roboto font-medium text-black bg-white/90 backdrop-blur-md rounded-lg py-2 px-4 transition-colors duration-300 text-sm tracking-wide hover:bg-white/95"
                  >
                    Signup
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/app"
                    className="font-roboto font-light text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200"
                  >
                    App
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="font-roboto font-light text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white/60 hover:text-white/90 p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div key={link.path}>
                      <button
                        onClick={() => setIsTradingMobileOpen(!isTradingMobileOpen)}
                        className={`w-full px-2 py-2 text-sm font-roboto font-light tracking-wide transition-colors duration-200 flex items-center justify-between ${
                          isActive(link.path)
                            ? 'text-white'
                            : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isTradingMobileOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isTradingMobileOpen && (
                        <div className="pl-4 mt-1 space-y-1">
                          {tradingTypes.map((type) => (
                            <Link
                              key={type.path}
                              to={type.path}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsTradingMobileOpen(false);
                              }}
                              className={`block px-2 py-2 text-sm font-roboto font-light tracking-wide transition-colors duration-200 ${
                                isActive(type.path)
                                  ? 'text-white'
                                  : 'text-white/50 hover:text-white/80'
                              }`}
                            >
                              {type.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-2 py-2 text-sm font-roboto font-light tracking-wide transition-colors duration-200 ${
                      isActive(link.path)
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                {!isLoggedIn ? (
                  <>
                    <button 
                      onClick={() => {
                        handleLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-2 py-2 text-sm font-roboto font-light text-white/80 hover:text-white tracking-wide transition-colors duration-200 text-left"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => {
                        handleLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="launch-app-button font-roboto font-medium text-black bg-white/90 backdrop-blur-md rounded-lg py-2 px-4 transition-colors duration-300 text-sm tracking-wide hover:bg-white/95 text-center"
                    >
                      Signup
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/app"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-2 py-2 text-sm font-roboto font-light text-white/80 hover:text-white tracking-wide transition-colors duration-200 text-left"
                    >
                      App
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-2 py-2 text-sm font-roboto font-light text-white/80 hover:text-white tracking-wide transition-colors duration-200 text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

