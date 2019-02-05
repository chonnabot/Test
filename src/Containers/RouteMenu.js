import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ListGiphy from '../Components/ListMovie';
import ListFavorite from '../Components/favorite/list';
import Profile from '../Components/profile';

function RouteMenu(props) {
  return (
    <Switch>
      <Route
        path="/giphy"
        exact
        render={() => {
          return (
            <ListGiphy
              items={props.items}
            />
          );
        }}
      />
      <Route path="/favorite" exact component={ListFavorite} />
      <Route path="/profile" exact component={Profile} />
      <Redirect from="/*" exact to="/" />
    </Switch>
  );
}

export default RouteMenu;
