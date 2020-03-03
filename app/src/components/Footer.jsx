import React from 'react';
import { Grid } from 'semantic-ui-react';
//import './Footer.css';

const Footer = () =>
{
  
    var today = new Date();

      return (
        <Grid style={{marginTop: '50px'}}>
          <Grid.Column textAlign="center">
            {`© Copyright ${today.getFullYear()}.`}
          </Grid.Column>
        </Grid>
      );
}

export default Footer;