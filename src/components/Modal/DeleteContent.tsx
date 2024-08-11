import { Modal,Button } from 'antd';

interface DeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      title="ยืนยันการลบ"
      visible={visible}
      centered
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          ยกเลิก
        </Button>,
        <Button key="delete" type="primary" danger onClick={onConfirm}>
          ลบ
        </Button>,
      ]}
    >
      <p>คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?</p>
    </Modal>
  );
};

export default DeleteModal;
