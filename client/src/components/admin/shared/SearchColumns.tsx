import { Button, Input, Space } from 'antd';

const SearchColumns = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        value={selectedKeys[0]}
        onChange={(e) => {
          setSelectedKeys(e.target.value ? [e.target.value] : []);
        }}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          size="small"
          style={{ width: 90 }}
          onClick={() => confirm()}
        >
          search
        </Button>
        <Button
          size="small"
          style={{ width: 90 }}
          onClick={() => {
            clearFilters();
          }}
        >
          reset
        </Button>
      </Space>
    </div>
  );

export default SearchColumns
