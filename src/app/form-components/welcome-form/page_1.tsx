

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page1: React.FC = ({settings} : any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-sans text-black">
        {/* Top: Logo */}
        <div className="w-full max-w-md mx-auto px-6 pt-10 flex justify-center">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="mb-6"
            width={200}
            height={80}
          />
        </div>

        {/* Middle: Content fills available space */}
        <div className="flex-grow flex flex-col items-center justify-center px-6">
          {/* Title */}
          <p className="font-bold text-center text-sm mb-6">WELCOME PACK</p>
          <p className="text-center text-xs mb-12">HELPING YOU ACHIEVE GOALS AND BEYOND</p>

          {/* Red Infinity Image */}
          <img
            src="/welcomeimg/p1-1.png"
            alt="Red infinity symbol"
            className="mb-20"
            width={200}
            height={100}
          />

          {/* 4 Flags Row */}
          <div className="flex justify-center space-x-4 mb-20">
            <img
              src="/welcomeimg/p1-2.png"
              alt="NDIS logo"
              className="w-14 h-14 object-contain"
            />
            <img
              src="/welcomeimg/p1-3.png"
              alt="Rainbow pride flag"
              className="w-14 h-10 object-contain"
            />
            <img
              src="/welcomeimg/p1-4.png"
              alt="Aboriginal flag"
              className="w-14 h-10 object-contain"
            />
            <img
              src="/welcomeimg/p1-5.png"
              alt="Torres Strait Islander flag"
              className="w-14 h-10 object-contain"
            />
          </div>
        </div>

        {/* Bottom: Footer */}
        <footer className="w-full border-t border-gray-300 py-4 text-[10px] text-gray-500 mt-auto">
          <div className="max-w-3xl mx-auto px-6 flex justify-between">
            <span>Website: infinitysupportswa.org</span>
            <span>CF016</span>
            <span>Review Date: 14/03/2026</span>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
