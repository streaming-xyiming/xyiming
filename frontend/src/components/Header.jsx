import React from 'react';
import * as icons from './icons';
import {NavLink} from './kit';
import {NearAuthButton} from '../features/near-auth/NearAuthButton';
import classNames from 'classnames';
import {routes} from '../lib/routing';
import LogoText from '../images/logo_stream_with_text.svg';
import {useBool} from '../lib/useBool';
import {useRouteMatch} from 'react-router';

function MinifiedHeader() {
  const logo = (
    <div className="twind-flex twind-justify-start twind-items-center">
      <img src={LogoText} alt="xyiming logo" />
    </div>
  );
  return (
    <div
      className={classNames(
        'twind-py-4 twind-px-6',
        'twind-absolute twind-w-full twind-pt-8',
        'twind-flex twind-justify-center',
      )}
    >
      {logo}
    </div>
  );
}

function FullHeader() {
  const menuControl = useBool(false);

  const navigation = (
    <ul className="twind-flex-col lg:twind-flex-row twind-flex twind-justify-center ">
      <li className="twind-mb-2 lg:twind-mr-2 lg:twind-mb-0">
        <NavLink
          onClick={menuControl.turnOff}
          to={routes.account}
          icon={<icons.Account />}
        >
          Account
        </NavLink>
      </li>
      <li className="twind-mb-2 lg:twind-mr-2 lg:twind-mb-0">
        <NavLink
          onClick={menuControl.turnOff}
          to={routes.myStreams}
          icon={<icons.Streams />}
        >
          My Streams
        </NavLink>
      </li>
      <li className="twind-mb-2 lg:twind-mr-2 lg:twind-mb-0">
        <NavLink
          onClick={menuControl.turnOff}
          to={routes.send}
          icon={<icons.Send />}
        >
          Send
        </NavLink>
      </li>
    </ul>
  );

  const logo = (
    <div className="twind-flex twind-justify-start twind-items-center">
      <img src={LogoText} alt="xyiming logo" />
    </div>
  );

  return (
    <div className={'twind-py-4 twind-px-6 twind-w-full twind-pt-8'}>
      <div
        className={classNames(
          'twind-hidden lg:twind-grid twind-items-center twind-grid-cols-3 twind-gap-3 ',
        )}
      >
        {logo}
        {navigation}

        <div className="twind-flex twind-justify-end">
          <NearAuthButton />
        </div>
      </div>

      <div className={classNames('lg:twind-hidden')}>
        <div className="twind-flex twind-justify-between">
          {logo}

          <button
            className="twind-p-1"
            onClick={menuControl.toggle}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div
              className={classNames(
                'burger-menu',
                menuControl.on ? 'burger-menu--active' : '',
              )}
            />
          </button>
        </div>
        <div
          className={classNames(
            menuControl.on ? 'twind-block' : 'twind-hidden',
            'twind-mt-4',
          )}
        >
          {navigation}
          <NearAuthButton className="mt-4" />
        </div>
      </div>
    </div>
  );
}
export function Header() {
  const match = useRouteMatch('/authorize');

  if (match) {
    return <MinifiedHeader />;
  }

  return <FullHeader />;
}
