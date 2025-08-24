interface ProfileIconProps {
  user: any;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  className?: string;
  onClick?: () => void;
  testId?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const sigilSizes = {
  sm: 'text-[8px] sm:text-[10px]',
  md: 'text-[10px] sm:text-[12px]',
  lg: 'text-[12px] sm:text-[14px]',
  xl: 'text-[14px] sm:text-[16px]'
};

export function ProfileIcon({ 
  user, 
  size = 'md', 
  showGlow = false, 
  className = '', 
  onClick, 
  testId 
}: ProfileIconProps) {
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition-transform duration-500`;
  const glowClasses = showGlow ? 'hover:scale-110' : 'hover:scale-105';
  const containerClasses = `${baseClasses} ${glowClasses} ${className}`;

  const content = (
    <>
      {user?.profileImageUrl ? (
        <div className="w-full h-full bg-black rounded-full overflow-hidden">
          <img 
            src={user.profileImageUrl} 
            alt="Profile" 
            className="w-full h-full object-cover rounded-full"
            style={{ objectPosition: 'center' }}
            data-testid={testId ? `img-${testId}` : 'img-profile'}
          />
        </div>
      ) : user?.sigilImageUrl ? (
        <div className="w-full h-full bg-black rounded-full overflow-hidden">
          <img 
            src={user.sigilImageUrl} 
            alt="Sigil" 
            className="w-full h-full object-cover rounded-full"
            style={{ objectPosition: 'center' }}
            data-testid={testId ? `img-${testId}` : 'img-sigil'}
            onError={(e) => {
              // Fallback to text sigil if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        </div>
      ) : user?.sigil ? (
        <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-blue-900/60 rounded-full flex items-center justify-center p-2" style={{ display: user?.sigilImageUrl ? 'none' : 'flex' }}>
          <div className="text-center leading-none">
            <pre className={`${sigilSizes[size]} text-white font-mono whitespace-pre-wrap break-words`} data-testid={testId ? `text-${testId}` : 'text-sigil'}>
              {user.sigil}
            </pre>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-full flex items-center justify-center border border-purple-400/30">
          <div className="text-primary text-2xl">✨</div>
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={containerClasses}
        data-testid={testId ? `button-${testId}` : 'button-profile'}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={containerClasses} data-testid={testId || 'profile-icon'}>
      {content}
    </div>
  );
}