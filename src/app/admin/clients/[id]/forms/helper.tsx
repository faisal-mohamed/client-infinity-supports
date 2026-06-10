import { 
  FaEdit, FaEye, FaArrowLeft, FaPlus, FaSignature, FaCheck, FaClock, 
  FaFileAlt, FaTimes, FaLink, FaCopy, FaDownload, FaEllipsisV, 
  FaUser, FaCalendarAlt, FaChartLine, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaUserEdit
} from 'react-icons/fa';



export const CardHeaders = ({stats} : {
    stats: any 
}) => {
    return <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-azure-100/60 p-5 transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-azure-100">
                    <FaFileAlt className="h-6 w-6 text-azure-700" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-azure-500">Total Forms</p>
                    <p className="text-2xl font-bold text-azure-700">{stats.total}</p>
                  </div>
                </div>
              </div>
    
              <div className="bg-white rounded-xl shadow-sm border border-azure-100/60 p-5 transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-emerald-100">
                    <FaCheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-azure-500">Completed</p>
                    <p className="text-2xl font-bold text-azure-700">{stats.completed}</p>
                  </div>
                </div>
              </div>
    
              <div className="bg-white rounded-xl shadow-sm border border-azure-100/60 p-5 transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-azure-100">
                    <FaClock className="h-6 w-6 text-azure-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-azure-500">In Progress</p>
                    <p className="text-2xl font-bold text-azure-700">{stats.inProgress}</p>
                  </div>
                </div>
              </div>
    
              <div className="bg-white rounded-xl shadow-sm border border-azure-100/60 p-5 transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-azure-100">
                    <FaExclamationTriangle className="h-6 w-6 text-azure-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-azure-500">Not Started</p>
                    <p className="text-2xl font-bold text-azure-700">{stats.notStarted}</p>
                  </div>
                </div>
              </div>
            </div>
}



export const selfManaged = `The Individual has chosen to self-manage the funding for NDIS supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will send the Individual an invoice for those supports for the Individual to pay. The Individual will pay the invoice within 7 days.`
export const nomineeManaged =  `The Individual’s Nominee manages the funding for supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will send the Individual’s Nominee an invoice for those supports for the Individual’s Nominee to pay. The Individual’s Nominee will pay the invoice within 7 days.`
export const ndiaManaged = `The Individual has nominated the NDIA to manage the funding for supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will claim payment for those supports from the NDIA.`
export const planManagerManaged = `The Individual has nominated the Plan Management Provider 
to manage the funding for NDIS supports provided under this Service Agreement. After providing those services, Infinity Supports WA will claim payment for those services from Registered Plan Management Provider.
`