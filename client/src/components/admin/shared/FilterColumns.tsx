import { Button, Select, Space } from "antd";
const { Option } = Select;

const FilterColumns = ({ setSelectedKeys, confirm, clearFilters, filters }) => {
  return (
    <div className="flex flex-col space-x-1 space-y-2">
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="select "
        defaultOpen
        onChange={(value) => {
          setSelectedKeys(value ? [value] : []);
        }}
      >
        {filters.map((filter) => (
          <Option key={filter.value} value={filter.value}>
            {filter.text}
          </Option>
        ))}
      </Select>
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
};
export default FilterColumns;
