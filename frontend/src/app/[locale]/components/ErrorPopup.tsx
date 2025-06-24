'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type ErrorPopupProps = {
  message: string;
  onCloseAction: () => void;
  autoCloseTime?: number; // czas w ms, po jakim popup się zamknie automatycznie
};

export const ErrorPopup = ({ message, onCloseAction, autoCloseTime = 5000 }: ErrorPopupProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onCloseAction, 300); // Daj czas na animację zamknięcia
    }, autoCloseTime);

    return () => clearTimeout(timer);
  }, [autoCloseTime, onCloseAction]);

  return (
      <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                style={{
                  position: 'fixed',
                  top: '16px',
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '0 16px'
                }}
            >
              <Box
                  sx={{
                    maxWidth: 'md',
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: '#ffebee',
                    borderLeft: 4,
                    borderColor: '#d32f2f',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2
                  }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ErrorOutlineIcon sx={{ color: '#d32f2f', mr: 1.5 }} />
                  <Typography
                      variant="body1"
                      sx={{
                        color: '#d32f2f',
                        fontSize: { xs: '14px', md: '16px' }
                      }}
                  >
                    {message}
                  </Typography>
                </Box>
                <IconButton
                    size="small"
                    onClick={() => {
                      setIsVisible(false);
                      setTimeout(onCloseAction, 300);
                    }}
                    sx={{
                      color: '#d32f2f',
                      '&:hover': {
                        color: '#b71c1c'
                      }
                    }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </motion.div>
        )}
      </AnimatePresence>
  );
};