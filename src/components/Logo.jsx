import logo from '../assets/logo.png';

export const Logo = ({ height = 32, alt = "Charlee's Jobtracker" }) => {
  return (
    <img
      src={logo}
      alt={alt}
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
    />
  );
};