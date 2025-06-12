"use client";

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/Confirm';
import Alert from '@/components/ui/Alert';
import Modal from '@/components/ui/Modal';

export default function ExampleUsage() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Example function to show a toast notification
  const handleShowToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    showToast({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      message: `This is a ${type} toast notification example.`,
      duration: 5000,
    });
  };

  // Example function to show a confirmation dialog
  const handleShowConfirm = async (type: 'danger' | 'warning' | 'info' | 'question') => {
    const result = await confirm({
      type,
      title: 'Confirmation Required',
      message: 'Are you sure you want to perform this action?',
      confirmText: 'Yes, Continue',
      cancelText: 'Cancel',
    });

    if (result) {
      showToast({
        type: 'success',
        message: 'Action confirmed!',
      });
    } else {
      showToast({
        type: 'info',
        message: 'Action cancelled.',
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">UI Components Examples</h1>

      {/* Toast Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleShowToast('success')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Success Toast
          </button>
          <button
            onClick={() => handleShowToast('error')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Error Toast
          </button>
          <button
            onClick={() => handleShowToast('warning')}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Warning Toast
          </button>
          <button
            onClick={() => handleShowToast('info')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Info Toast
          </button>
        </div>
      </section>

      {/* Confirm Dialog Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Confirmation Dialogs</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleShowConfirm('danger')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Danger Confirm
          </button>
          <button
            onClick={() => handleShowConfirm('warning')}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Warning Confirm
          </button>
          <button
            onClick={() => handleShowConfirm('info')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Info Confirm
          </button>
          <button
            onClick={() => handleShowConfirm('question')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Question Confirm
          </button>
        </div>
      </section>

      {/* Alert Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Alert Components</h2>
        <div className="space-y-4">
          {showAlert && (
            <Alert type="success" title="Success Alert" onClose={() => setShowAlert(false)}>
              This is a success alert with a close button.
            </Alert>
          )}
          <Alert type="error" title="Error Alert">
            This is an error alert without a close button.
          </Alert>
          <Alert type="warning">
            This is a warning alert without a title.
          </Alert>
          <Alert type="info" title="Information">
            This is an informational alert with additional details.
          </Alert>
        </div>
      </section>

      {/* Modal Example */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Modal Dialog</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Open Modal
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          size="md"
        >
          <div className="p-4">
            <p className="mb-4">This is an example modal dialog with custom content.</p>
            <p className="mb-6">You can put any content here, including forms, tables, or other components.</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close Modal
              </button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
}
