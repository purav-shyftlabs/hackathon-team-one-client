"use client";
import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Navbar from './Navbar';
const { Header, Content, Footer } = Layout;
const items = Array.from({ length: 3 }).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));
const App = ({children}) => {
  
  return (
    <Layout>
      {/* <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      > */}
        <Navbar />
      {/* </Header> */}
      <Content style={{ padding: '0 48px', backgroundColor: '#fff' }}>
        {children}
      </Content>
      
    </Layout>
  );
};
export default App;