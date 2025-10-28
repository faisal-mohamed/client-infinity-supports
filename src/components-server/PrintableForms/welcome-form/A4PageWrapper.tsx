const styles = `
.a4-page {
  box-sizing: border-box;
  width: 210mm;
  height: 297mm;
  background: white;
  border: none; /* Or include in box-sizing calculations */
  margin: 0;     /* NO margin! */
  padding: 0;    /* NO padding! */
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
  flex-shrink: 0; /* Never shrink! */
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