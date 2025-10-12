import { Button } from '../components/Button';
import { ShareIcon } from '../icons/share';
import { PlusIcon } from '../icons/PlusIcon';
import { Card } from '../components/Card';
import '../App.css';
import { Sidebar } from '../components/SidebarComponent';
import { useState } from 'react';
// import { createContext } from 'react';
import { CreateContentModel } from '../components/CreateContentModel';
export function Dashboard() {
   const [modelOpen,setModelOpen]=useState(false);
  return (   <div>
    <Sidebar/>

    <div className="p-4  ml-72 h-min-screen">

      <CreateContentModel open={modelOpen}
      onClose={()=>setModelOpen(false)}/>
      <div className="flex gap-4 justify-end">
        <Button
          variant="primary"
          text="Share Brain"
          startIcon={<ShareIcon />}
        />
        <Button onClick={()=>{
          setModelOpen(true)
        }}
          variant="secondary"
          text="Add Content"
          startIcon={<PlusIcon />}
        />
      </div >
<div className='flex gap-4'>
      <Card
        type="twitter"
        link="https://twitter.com/thdxr/status/1976584596314894782?ref_src=twsrc%5Etfw"
        title="First Tweet"
      />

      <Card
        type="youtube"
        link="https://youtu.be/NoqnQaxfhXU"
        title="First Video"
      /></div>
{/*       
    <createContext/> */}
     
    </div></div>
  );
}

export default Dashboard;
