import React from 'react';
import styled from 'styled-components';

const A4Container = styled.div`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  padding: 20mm;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  page-break-after: always;

  @media print {
    margin: 0;
    box-shadow: none;
    page-break-after: always;
    page-break-inside: avoid;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 10mm;
  border-top: 1px solid #eee;
`;

const PageNumber = styled.div`
  position: absolute;
  bottom: 10mm;
  right: 10mm;
  font-size: 0.8rem;
  color: #666;
`;

interface A4PageProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  pageNumber?: number;
  totalPages?: number;
}

const A4Page: React.FC<A4PageProps> = ({ children, footer, pageNumber, totalPages }) => {
  return (
    <A4Container>
      <Content>{children}</Content>
      {footer && <Footer>{footer}</Footer>}
      {pageNumber && totalPages && (
        <PageNumber>Page {pageNumber} of {totalPages}</PageNumber>
      )}
    </A4Container>
  );
};

export default A4Page;
