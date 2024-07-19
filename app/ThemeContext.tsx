"use client"

export default function ThemeContext({
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="theme-light">
      {children}
    </div>
  );
}