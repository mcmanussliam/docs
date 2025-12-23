import Link from 'next/link';
import {NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList} from '../ui/navigation-menu';
import {ModeToggle} from './mode-toggle';

export default function Root() {
  return (
    <NavigationMenu className='max-w-none w-full flex justify-between p-5'>
      <NavigationMenuList className='gap-3'>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/projects">Projects</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="https://github.com/mcmanussliam">GitHub</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuList className='gap-3'>
        <NavigationMenuItem>
          <ModeToggle/>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
