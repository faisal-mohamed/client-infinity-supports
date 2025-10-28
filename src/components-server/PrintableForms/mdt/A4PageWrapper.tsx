// import React from 'react';

// interface A4PageWrapperProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const A4PageWrapper: React.FC<A4PageWrapperProps> = ({ children, className = '' }) => {
//   return (
//     <div
//       className={`
//         a4-page
//         w-[210mm] h-[297mm]
//         mx-auto mb-8
//         bg-white
//         shadow-lg
//         border border-gray-300
//         flex flex-col
//         print:shadow-none
//         print:mb-0
//         print:border-none
//         p-0
//         ${className}
//       `}
//     >
//       {children}
//     </div>
//   );
// };


// export default A4PageWrapper;


const styles = `
.a4-page {
  box-sizing: border-box;
  width: 210mm;
  height: 297mm;
  background: white;
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.a4-inner {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-height: 0;
  height: 100%;
}
footer {
  flex-shrink: 0;
}
`;

const A4PageWrapper = ({ children } : any ) => (
  <>
    <style>{styles}</style>
    <div className="a4-page">
      {children}
    </div>
  </>
);

export default A4PageWrapper;
