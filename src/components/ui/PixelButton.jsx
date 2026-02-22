export default function PixelButton({ children, variant = 'default', className = '', ...props }) {
  return (
    <button className={`pixel-button ${variant !== 'default' ? variant : ''} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
