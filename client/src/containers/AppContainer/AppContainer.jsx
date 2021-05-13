import React, { Suspense } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';

import { AppPage } from '../../components/application/AppPage';
import { useFetch } from '../../hooks/use_fetch';
import { fetchJSON } from '../../utils/fetchers';
// import { AuthModalContainer } from '../AuthModalContainer';
// import { NewPostModalContainer } from '../NewPostModalContainer';
// import { NotFoundContainer } from '../NotFoundContainer';
// import { PostContainer } from '../PostContainer';
// import { TermContainer } from '../TermContainer';
// import { TimelineContainer } from '../TimelineContainer';
// import { UserProfileContainer } from '../UserProfileContainer';

const AuthModalContainer = React.lazy(() => import('../AuthModalContainer'));
const NewPostModalContainer = React.lazy(() => import('../NewPostModalContainer'));
const NotFoundContainer = React.lazy(() => import('../NotFoundContainer'));
const PostContainer = React.lazy(() => import('../PostContainer'));
const TermContainer = React.lazy(() => import('../TermContainer'));
const TimelineContainer = React.lazy(() => import('../TimelineContainer'));
const UserProfileContainer = React.lazy(() => import('../UserProfileContainer'));

/** @type {React.VFC} */
const AppContainer = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // TODO: これけせそう?
  const [activeUser, setActiveUser] = React.useState(null);
  const { data } = useFetch('/api/v1/me', fetchJSON);
  React.useEffect(() => {
    setActiveUser(data);
  }, [data]);

  const [modalType, setModalType] = React.useState('none');
  const handleRequestOpenAuthModal = React.useCallback(() => setModalType('auth'), []);
  const handleRequestOpenPostModal = React.useCallback(() => setModalType('post'), []);
  const handleRequestCloseModal = React.useCallback(() => setModalType('none'), []);

  return (
    <Suspense fallback={<></>}>
      <AppPage
        activeUser={activeUser}
        onRequestOpenAuthModal={handleRequestOpenAuthModal}
        onRequestOpenPostModal={handleRequestOpenPostModal}
      >
        <Switch>
          <Route exact path="/">
            <TimelineContainer />
          </Route>
          <Route exact path="/users/:username">
            <UserProfileContainer />
          </Route>
          <Route exact path="/posts/:postId">
            <PostContainer />
          </Route>
          <Route exact path="/terms">
            <TermContainer />
          </Route>
          <Route path="*">
            <NotFoundContainer />
          </Route>
        </Switch>
      </AppPage>

      {modalType === 'auth' ? (
        <AuthModalContainer onRequestCloseModal={handleRequestCloseModal} onUpdateActiveUser={setActiveUser} />
      ) : null}
      {modalType === 'post' ? <NewPostModalContainer onRequestCloseModal={handleRequestCloseModal} /> : null}
    </Suspense>
  );
};

export { AppContainer };
