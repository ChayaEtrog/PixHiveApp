import { useEffect, useRef, useState } from 'react';
import ImageIcon from '../../assets/Icons/imageIcon.png';

export const LazyImage = ({ src, alt }: { src: string; alt?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
  
      if (ref.current) {
        observer.observe(ref.current);
      }
  
      return () => observer.disconnect();
    }, []);
  
    return (
      <div
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isVisible ? (
          <>
            {!isLoaded &&<img src={ImageIcon} alt={alt} style={{width:'140px'}}/>}
            <img
              src={src}
              alt={alt || 'image'}
              onLoad={() => setIsLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: isLoaded ? 'block' : 'none',
              }}
              
            />
          </>
        ) : (
         <img src={ImageIcon} alt={alt} style={{width:'150px'}}/>
        )}
      </div>
    );
};