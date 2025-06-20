import ClientIntakeForm from '../components/forms/ClientIntakeForm';
import ClientIntakeFormEnhanced from '../components/forms/ClientIntakeFormEnhanced';
import ClientIntakeFormResponsive from '../components/forms/ClientIntakeFormResponsive';

const formRegistry: Record<string, React.ComponentType<any>> = {
  'client_intake_form': ClientIntakeFormResponsive, // Using the responsive version
  'client_intake_form_enhanced': ClientIntakeFormEnhanced, // Enhanced version
  'client_intake_form_simple': ClientIntakeForm, // Keep the simple version as backup
  
};

export default formRegistry;
