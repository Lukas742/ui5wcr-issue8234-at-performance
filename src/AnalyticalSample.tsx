import { memo, useCallback, useMemo, useState } from "react";
import "@ui5/webcomponents-icons/dist/status-positive.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import {
  AnalyticalTable,
  type AnalyticalTableCellInstance,
  type AnalyticalTablePropTypes,
} from "@ui5/webcomponents-react/AnalyticalTable";
import { AnalyticalTableSelectionBehavior } from "@ui5/webcomponents-react/enums/AnalyticalTableSelectionBehavior";
import { AnalyticalTableSelectionMode } from "@ui5/webcomponents-react/enums/AnalyticalTableSelectionMode";
import { AnalyticalTableVisibleRowCountMode } from "@ui5/webcomponents-react/enums/AnalyticalTableVisibleRowCountMode";
import { FlexBox } from "@ui5/webcomponents-react/FlexBox";
import { FlexBoxDirection } from "@ui5/webcomponents-react/enums/FlexBoxDirection";
import { FlexibleColumnLayout } from "@ui5/webcomponents-react/FlexibleColumnLayout";
import { Icon } from "@ui5/webcomponents-react/Icon";
import { Text } from "@ui5/webcomponents-react/Text";
import { Title } from "@ui5/webcomponents-react/Title";
import FCLLayout from "@ui5/webcomponents-fiori/dist/types/FCLLayout";
import styles from "./AnalyticalSample.module.css";

type UserRow = {
  id: string;
  status: "Active" | "Inactive";
  role: "Admin" | "Editor" | "Viewer";
  firstName: string;
  lastName: string;
  email: string;
  department: string;
};

function makeUsers(count = 100): UserRow[] {
  const depts = ["IT", "HR", "Sales", "Finance", "Ops"];
  const roles: UserRow["role"][] = ["Admin", "Editor", "Viewer"];

  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      id: `U-${String(n).padStart(3, "0")}`,
      status: n % 5 === 0 ? "Inactive" : "Active",
      role: roles[n % roles.length],
      firstName: `First${n}`,
      lastName: `Last${n}`,
      email: `user${n}@example.com`,
      department: depts[n % depts.length],
    };
  });
}

// Memoized cell component for status column
const StatusCell = memo(function StatusCell({
  cell,
}: AnalyticalTableCellInstance) {
  return (
    <Icon
      name={cell.value === "Active" ? "status-positive" : "employee"}
      title={String(cell.value)}
    />
  );
});

// Memoized StartColumn component - creates render boundary
const StartColumn = memo(function StartColumn({
  data,
  columns,
  onRowSelect,
}: {
  data: UserRow[];
  columns: AnalyticalTablePropTypes["columns"];
  onRowSelect: (e: CustomEvent) => void;
}) {
  return (
    <div className={styles.fullHeight} slot="startColumn">
      <AnalyticalTable
        data={data}
        columns={columns}
        minRows={1}
        header={<Title level="H4">Users</Title>}
        visibleRowCountMode={
          AnalyticalTableVisibleRowCountMode.AutoWithEmptyRows
        }
        noDataText="No users found."
        selectionMode={AnalyticalTableSelectionMode.Single}
        selectionBehavior={AnalyticalTableSelectionBehavior.RowOnly}
        onRowSelect={onRowSelect}
        filterable={false}
        sortable={false}
        rowHeight={30}
      />
    </div>
  );
});

// Memoized MidColumn component - creates render boundary
const MidColumn = memo(function MidColumn({
  selectedUser,
  onClose,
}: {
  selectedUser: UserRow | null;
  onClose: () => void;
}) {
  return (
    <div className={styles.fullHeight} slot="midColumn">
      <FlexBox direction={FlexBoxDirection.Column} className={styles.detailsContainer}>
        <FlexBox className={styles.detailsHeader}>
          <Title level="H4">Details</Title>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </FlexBox>

        {!selectedUser ? (
          <Text>Select a user to see details.</Text>
        ) : (
          <>
            <Text>ID: {selectedUser.id}</Text>
            <Text>
              Name: {selectedUser.firstName} {selectedUser.lastName}
            </Text>
            <Text>Email: {selectedUser.email}</Text>
            <Text>Department: {selectedUser.department}</Text>
            <Text>Role: {selectedUser.role}</Text>
            <Text>Status: {selectedUser.status}</Text>
          </>
        )}
      </FlexBox>
    </div>
  );
});

export default function UsersFclSample() {
  const data = useMemo(() => makeUsers(100), []);
  const [layout, setLayout] = useState<FCLLayout>(FCLLayout.OneColumn);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const columns: AnalyticalTablePropTypes["columns"] = useMemo(
    () => [
      {
        Header: "",
        accessor: "status",
        width: 50,
        minWidth: 50,
        Cell: StatusCell,
        headerLabel: "Status",
      },
      { Header: "ID", accessor: "id" },
      { Header: "First name", accessor: "firstName" },
      { Header: "Last name", accessor: "lastName" },
      { Header: "Email", accessor: "email" },
      { Header: "Department", accessor: "department" },
      { Header: "Role", accessor: "role" },
    ],
    [],
  );

  const onRowSelect = useCallback((e: CustomEvent) => {
    const row = e.detail?.row;
    const original: UserRow | undefined = row?.original;
    if (!original) return;

    setSelectedUser(original);
    setLayout(FCLLayout.TwoColumnsStartExpanded);
  }, []);

  const closeDetails = useCallback(() => {
    setLayout(FCLLayout.OneColumn);
    setSelectedUser(null);
  }, []);

  return (
    <FlexibleColumnLayout
      className={styles.fcl}
      layout={layout}
      startColumn={
        <StartColumn data={data} columns={columns} onRowSelect={onRowSelect} />
      }
      midColumn={
        <MidColumn selectedUser={selectedUser} onClose={closeDetails} />
      }
    />
  );
}
