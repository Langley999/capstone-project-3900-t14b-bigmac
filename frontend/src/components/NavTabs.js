import * as React from 'react';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { Link, useParams } from "react-router-dom";
import '../App.css';
import {Box, Button, Tab, Tabs} from "@material-ui/core";

const indigo = {
  50: '#e8eaf6',
  100: '#c5cae9',
  200: '#9fa8da',
  300: '#7986cb',
  400: '#5c6bc0',
  500: '#3f51b5',
  600: '#3949ab',
  700: '#303f9f',
  800: '#283593',
  900: '#1a237e',
};

// const Tab = styled(TabUnstyled)`
//   font-family: IBM Plex Sans, sans-serif;
//   color: white;
//   cursor: pointer;
//   font-weight: bold;
//   background-color: transparent;
//   width: 100%;
//   padding: 12px 16px;
//   margin: 6px 6px;
//   border: none;
//   border-radius: 5px;
//   display: flex;
//   justify-content: center;
//
//   &:hover {
//     background-color: ${indigo[400]};
//   }
//
//   &:focus {
//     color: #fff;
//     border-radius: 3px;
//     outline: 2px solid ${indigo[200]};
//     outline-offset: 2px;
//   }
//
//   &.${tabUnstyledClasses.selected} {
//     background-color: ${indigo[50]};
//     color: ${indigo[600]};
//   }
//
//   &.${buttonUnstyledClasses.disabled} {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;
//
// const TabsList = styled(TabsListUnstyled)`
//   min-width: 320px;
//   background-color: ${indigo[500]};
//   border-radius: 8px;
//   margin-bottom: 16px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   align-content: space-between;
// `;

const NavTabs = () => {
  const urlParams = useParams();
  const user_id = urlParams.userid;
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {/*<Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">*/}
          {/*  <Tab*/}
          {/*    label='Profile'*/}
          {/*    component={Link}*/}
          {/*    to={`/user/${user_id}/profile`}*/}
          {/*    className='remove-underline'*/}
          {/*  >*/}
          {/*    Profile*/}
          {/*  </Tab>*/}
          {/*  <Tab*/}
          {/*    label='Collections'*/}
          {/*    component={Link}*/}
          {/*    to={`/user/${user_id}/collections`}*/}
          {/*    className='remove-underline'*/}
          {/*  >*/}
          {/*    Collections*/}
          {/*  </Tab>*/}
          {/*  <Tab*/}
          {/*    label='Posts'*/}
          {/*    component={Link}*/}
          {/*    to={`/user/${user_id}/posts`}*/}
          {/*    className='remove-underline'*/}
          {/*  >*/}
          {/*    Posts*/}
          {/*  </Tab>*/}
          {/*  <Tab*/}
          {/*    label='Analytics'*/}
          {/*    component={Link}*/}
          {/*    to={`/user/${user_id}/analytics`}*/}
          {/*    className='remove-underline'*/}
          {/*  >*/}
          {/*    Analytics*/}
          {/*  </Tab>*/}
          {/*</Tabs>*/}
        </Box>
        <button  onClick={() => setValue(1)}>switch</button>
        {/*<h1>{value}</h1>*/}
      </Box>


      {/*<TabsUnstyled  value={value} onChange={handleChangeTab}>*/}
      {/*  <TabsList>*/}
      {/*    <Tab*/}
      {/*      // value='0'*/}
      {/*      // onClick={() => handleChangeTab(0)}*/}
      {/*      label='Profile'*/}
      {/*      component={Link}*/}
      {/*      to={`/user/${user_id}/profile`}*/}
      {/*      className='remove-underline'*/}
      {/*    >*/}
      {/*      Profile*/}
      {/*    </Tab>*/}
      {/*    <Tab*/}
      {/*      // value='1'*/}
      {/*      // onClick={() => handleChangeTab(1)}*/}
      {/*      label='Collections'*/}
      {/*      component={Link}*/}
      {/*      to={`/user/${user_id}/collections`}*/}
      {/*      className='remove-underline'*/}
      {/*    >*/}
      {/*      Collections*/}
      {/*    </Tab>*/}
      {/*    <Tab*/}
      {/*      // value='2'*/}
      {/*      // onClick={() => handleChangeTab(2)}*/}
      {/*      label='Posts'*/}
      {/*      component={Link}*/}
      {/*      to={`/user/${user_id}/posts`}*/}
      {/*      className='remove-underline'*/}
      {/*    >*/}
      {/*      Posts*/}
      {/*    </Tab>*/}
      {/*    <Tab*/}
      {/*      // value='3'*/}
      {/*      // onClick={() => handleChangeTab(3)}*/}
      {/*      label='Analytics'*/}
      {/*      component={Link}*/}
      {/*      to={`/user/${user_id}/analytics`}*/}
      {/*      className='remove-underline'*/}
      {/*    >*/}
      {/*      Analytics*/}
      {/*    </Tab>*/}
      {/*  </TabsList>*/}
      {/*</TabsUnstyled>*/}
      {/*<h1>{value}</h1>*/}
      {/*<button onClick={() => handleChangeTab(1)}>Switch</button>*/}
    </>
  );
}

export default NavTabs;

