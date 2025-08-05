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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-indigo-100">
                    <FaFileAlt className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Forms</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
    
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <FaCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </div>
    
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <FaClock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  </div>
                </div>
              </div>
    
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gray-100">
                    <FaExclamationTriangle className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Not Started</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.notStarted}</p>
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