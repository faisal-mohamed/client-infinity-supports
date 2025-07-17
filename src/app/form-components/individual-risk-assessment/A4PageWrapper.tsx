const A4PageWrapper = ({ children, className = "" } : any) => (
  <div className={`
    a4-page
    w-[210mm] h-[297mm] 
    mx-auto mb-8 
    bg-white 
    shadow-lg 
    border border-gray-300
    flex flex-col
    ${className}
  `}>
    {children}
  </div>
);

export default A4PageWrapper;