import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";

const MainLayout = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <div className='h-screen bg-black text-white flex flex-col'>
      <ResizablePanelGroup
        direction='horizontal'
        className='flex-1 flex h-full overflow-hidden p-2'
      >
        {/* left panel */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
        >
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

        {/* main content */}
        <ResizablePanel
          defaultSize={isMobile ? 80 : 60}
          className='rounded-lg bg-zinc-900'
        >
          <Outlet />
        </ResizablePanel>
        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

        {/* right panel */}
        <ResizablePanel
          defaultSize={20}
          minSize={0}
          maxSize={25}
          collapsedSize={0}
          className='rounded-lg bg-zinc-900 p-4'
        >
          Friends Panel
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MainLayout;
