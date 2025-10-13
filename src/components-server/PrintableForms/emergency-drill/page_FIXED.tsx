import React from 'react'
import EmergencyDrillEnhanced from '../../../app/form-components/emergency-drill/page_enhanced';

// ===== PDF FONT STYLES =====
export const PDF_FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  .font-montserrat {
    font-family: 'Montserrat', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const EmergencyDrill_FIXED = ({formData, commonFieldsData, settings, images} : any) => {
  // Create enhanced settings with logo image
  const enhancedSettings = {
    ...settings,
    logoImage: images?.infinityLogo
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <div className="bg-gray-100 min-h-screen print:bg-white print:py-0">
        <div className="w-[900px] mx-auto py-8 print:py-0">
          <EmergencyDrillEnhanced 
            formData={formData} 
            commonFieldsData={commonFieldsData} 
            settings={enhancedSettings} 
            images={images}
          />
        </div>
      </div>
    </>
  )
}

export default EmergencyDrill_FIXED
