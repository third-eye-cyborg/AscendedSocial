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
  sm: 'text-[5px]',
  md: 'text-[6px]',
  lg: 'text-[7px]',
  xl: 'text-[8px]'
};

export function ProfileIcon({ 
  user, 
  size = 'md', 
  showGlow = false, 
  className = '', 
  onClick, 
  testId 
}: ProfileIconProps) {
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition-transform duration-300`;
  const glowClasses = showGlow ? 'hover:scale-110' : 'hover:scale-105';
  const containerClasses = `${baseClasses} ${glowClasses} ${className}`;

  const content = (
    <>
      {user?.profileImageUrl ? (
        <img 
          src={user.profileImageUrl} 
          alt="Profile" 
          className="w-full h-full object-cover rounded-full"
          data-testid={testId ? `img-${testId}` : 'img-profile'}
        />
      ) : user?.sigil ? (
        <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center p-1">
          <div className="text-center leading-none">
            <pre className={`${sigilSizes[size]} text-white font-mono whitespace-pre-wrap break-words`} data-testid={testId ? `text-${testId}` : 'text-sigil'}>
              {user.sigil}
            </pre>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center">
          <i className={`fas fa-lotus text-white ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : size === 'xl' ? 'text-xl' : 'text-base'}`}></i>
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