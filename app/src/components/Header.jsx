import React from 'react';
import { Menu, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Header  = ({menuItems, onClick}) =>
{
    return (
        <Menu inverted>
            <Container>
                {
                    menuItems.map(m => 
                        <Menu.Item 
                            key={m.title} 
                            name={m.title} 
                            as={Link} 
                            to={m.link}
                            active={m.active} 
                            onClick={() => onClick && onClick(m)} />
                    )
                }                
            </Container>
        </Menu>
    )
}

export default Header;