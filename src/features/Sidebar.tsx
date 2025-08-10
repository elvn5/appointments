"use client";
import { CalendarFilled, DashboardOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useState } from "react";

const { Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export const Sidebar: React.FC<PropsWithChildren> = (props) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const pathname = usePathname();

  const routeToKeyMap: { [key: string]: string } = {
    "/": "1",
    "/calendar": "2",
  };

  const selectedKey = routeToKeyMap[pathname] || "1";

  const items: MenuItem[] = [
    getItem(<Link href="/">Дашборд</Link>, "1", <DashboardOutlined />),
    getItem(<Link href="/calendar">Календарь</Link>, "2", <CalendarFilled />),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="light"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <div>{props.children}</div>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ermek Cherikchiev
        </Footer>
      </Layout>
    </Layout>
  );
};
