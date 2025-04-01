import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  Typography,
} from "antd";
import { type Gasto } from "~/utils/db/models";
import { sentimientoDefault } from "~/utils/db/models/Sentimiento";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es-mx";
import { useEffect, useMemo, useState } from "react";
import { updateGastos } from "~/utils/services/gastosService";
import { Recurrencia } from "~/utils/db/models/Gasto";
import { categoriasDefault } from "~/utils/db/models/Categorias";
import { useCategorias } from "~/utils/hooks/useCategorias";
dayjs.locale("es-mx");
interface Props {
  gastos: Record<string, Gasto[]>;
  paymentTypes: PaymentType[];
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType:
    | "number"
    | "text"
    | "date"
    | "categoriaId"
    | "sentimientoId"
    | "paymentTypeId";
  record: Gasto;
  index: number;
  categoriasSelect: any;
}

export function GastoList({ gastos, paymentTypes }: Props) {
  const { categoriasSelect } = useCategorias();
  const dataFormatted = useMemo(() => {
    return Object.keys(gastos).reduce<Record<string, any[]>>((acc, key) => {
      acc[key] = gastos[key].map((el) => ({
        ...el,
        fecha: dayjs(el.fecha),
      }));
      return acc;
    }, {});
  }, [gastos]);
  const [editingId, setEditingId] = useState(0);
  const [data, setData] = useState(dataFormatted);
  const [form] = Form.useForm();
  useEffect(() => {
    setData(dataFormatted);
  }, [dataFormatted]);
  const isEditing = (record: Gasto) => record.id === editingId;

  const edit = (record: Gasto) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingId(record.id!);
  };

  const cancel = () => {
    setEditingId(0);
  };
  const save = async (key: React.Key, paymentTypeId: number) => {
    try {
      const row = (await form.validateFields()) as Gasto;
      const paymentType = paymentTypes.find((el) => {
        if (el.id === paymentTypeId) {
          return true;
        }
      });
      const colKey = paymentType!.nombre;
      const currGastos = [...data[colKey]];
      const dataCopy = { ...data };
      const index = currGastos.findIndex((item) => Number(key) === item.id);
      if (index > -1) {
        const item = { ...currGastos[index], ...row };
        currGastos.splice(index, 1, {
          ...item,
          ...row,
        });

        updateData(item);
        dataCopy[colKey] = currGastos;
        setData(dataCopy);
        setEditingId(0);
      } else {
        currGastos.push(row);
        dataCopy[colKey] = currGastos;
        setData(dataCopy);
        setEditingId(0);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      editable: false,
    },

    {
      title: "Gasto",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a: Gasto, b: Gasto) => a.nombre.localeCompare(b.nombre),
      editable: true,
      dataType: "string",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      filterSearch: true,
      render: (precio: string) => {
        return "$" + precio;
      },
      sorter: (a: Gasto, b: Gasto) => a.precio - b.precio,
      editable: true,
      dataType: "number",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      render: (fecha: string) => {
        return dayjs(fecha).locale("es-mx").format("D-MMMM-YYYY");
      },
      sorter: (a: Gasto, b: Gasto) =>
        dayjs(a.fecha).isBefore(dayjs(b.fecha)) ? -1 : 1,
      editable: true,
      dataType: "date",
    },
    {
      title: "Sentimiento",
      dataIndex: "sentimientoId",
      key: "sentimientoId",
      render: (sentimiento: number) => (
        <>{sentimientoDefault[sentimiento - 1]?.nombre}</>
      ),
      editable: true,
      dataType: "sentimientoId",
    },
    {
      title: "Tipo de pago",
      dataIndex: "paymentTypeId",
      key: "paymentTypeId",
      editable: true,
      render: (paymentTypeId: number) => {
        return paymentTypes.find((payment) => payment.id === paymentTypeId)
          ?.nombre;
      },
      dataType: "number",
    },
    {
      title: "Categoria",
      dataIndex: "categoriaId",
      key: "categoriaId",
      editable: true,
      render: (categoriaId: number) => {
        if (categoriaId && categoriasDefault[categoriaId - 1]) {
          return categoriasDefault[categoriaId - 1].nombre;
        }
        return "";
      },
      dataType: "categoriaId",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: Gasto) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id, record.paymentTypeId)}
              style={{ marginInlineEnd: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingId !== 0}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns: TableProps<Gasto>["columns"] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Gasto) => ({
        record,
        inputType: col.dataType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        categoriasSelect,
      }),
    };
  });

  return (
    <div className="gap-2 flex-col">
      <Form form={form} component={false}>
        {Object.keys(data).map((key) => {
          return (
            <div key={key}>
              <h1>{key}</h1>
              <span>
                Total:
                {data[key].reduce((acc, curr) => acc + Number(curr.precio), 0)}
              </span>
              <Table<Gasto>
                components={{
                  body: { cell: EditableCell },
                }}
                rowKey={(col) => {
                  return `${key}-${col.id}`;
                }}
                bordered
                dataSource={data[key]}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ onChange: cancel }}
              />
              {/* <Table dataSource={gastos[key]} columns={columns}></Table> */}
            </div>
          );
        })}
      </Form>
    </div>
  );
}

const updateData = async (gasto: Gasto) => {
  debugger;
  const newData: Gasto = {
    ...gasto,
    id: Number(gasto.id),
    nombre: gasto.nombre,
    precio: Number(gasto.precio),
    fecha: (gasto.fecha as any).$d.toString(),
  };
  newData.paymentTypeId =
    newData.paymentTypeId === undefined ? 1 : newData.paymentTypeId;
  newData.sentimientoId =
    newData.sentimientoId === undefined ? 4 : newData.sentimientoId;
  if (newData.finRecurrencia && typeof newData.finRecurrencia !== "string") {
    newData.finRecurrencia = (newData.finRecurrencia as any).$d.toString();
  }
  if (newData.recurrencia === Recurrencia.MSI && newData.numMeses) {
    newData.finRecurrencia = dayjs(newData.fecha)
      .add(newData.numMeses, "month")
      .toString();
  }
  await updateGastos(newData);
};

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  defaultValue,
  categoriasSelect,
  ...restProps
}) => {
  let inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  if (inputType === "date") {
    inputNode = (
      <DatePicker name={dataIndex} style={{ margin: 0 }} format="YYYY-MM-DD" />
    );
  }
  if (inputType === "categoriaId") {
    inputNode = (
      <Select
        defaultValue={1}
        style={{ width: 200 }}
        options={categoriasSelect}
      />
    );
  }
  if (inputType === "paymentTypeId") {
    inputNode = (
      <Select
        defaultValue={1}
        style={{ width: 200 }}
        options={categoriasSelect}
      />
    );
  }
  if (inputType === "sentimientoId") {
    inputNode = (
      <Select
        defaultValue={1}
        style={{ width: 200 }}
        options={categoriasSelect}
      />
    );
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }} required>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
