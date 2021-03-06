import React from 'react';
import {useParams} from 'react-router';
import {Link} from 'react-router-dom';
import {useNear} from '../features/near-connect/useNear';
import {
  streamViewData,
  StreamOverviewCard,
  streamDirection,
  StreamActionHistory,
} from '../features/stream-view';
import {
  useAccount,
  useSingleStream,
  useSingleStreamHistory,
} from '../features/xyiming-resources';
import {StreamDashboard} from '../features/stream-view/StreamDashboard';
import copy from 'clipboard-copy';
import {Link as LinkIcon, ArrowLeft} from '../components/icons';
import {routes} from '../lib/routing';
import classNames from 'classnames';
import {PageError} from '../components/PageError';

function BackButton({to, className, ...rest}) {
  return (
    <Link
      to={to}
      className={classNames(
        'twind-group twind-flex twind-items-center',
        className,
      )}
      {...rest}
    >
      <div className="twind-flex twind-items-center twind-justify-center twind-h-11 twind-w-11 twind-rounded-full twind-border-border twind-border group-hover:twind-bg-border twind-mr-4">
        <ArrowLeft />
      </div>
      <span className="twind-uppercase twind-text-gray twind-text-xs">
        {' '}
        Back{' '}
      </span>
    </Link>
  );
}
function StreamCopyUrlBlock({className, link, ...rest}) {
  return (
    <div className={className} {...rest}>
      <div className="twind-mb-4 twind-text-gray twind-text-center">
        Public link to view the stream:
      </div>
      <div className="twind-border twind-border-border twind-bg-input twind-py-4 twind-px-5 twind-rounded-2xl twind-flex twind-items-center">
        <div className="twind-break-all twind-select-all">{link}</div>
        <div className="twind-w-px twind-bg-border twind-mx-6 twind-self-stretch twind-flex-shrink-0"></div>
        <button
          className="twind-whitespace-nowrap twind-text-blue twind-py-2 twind-px-3 twind-font-semibold twind-text-sm twind-inline-flex twind-bg-transparent hover:twind-bg-hover active:twind-bg-input twind-rounded-lg twind-transition"
          onClick={() => copy(link)}
          variant="filled"
        >
          <LinkIcon className="twind-mr-2" />
          Copy Link
        </button>
      </div>
    </div>
  );
}

const streamType = {
  stream_id: 'FnVkAYZu4XED3o44pZPvrnghVEMxo3GiHszUT4orjYST',
  description: 'test stream',
  owner_id: 'kpr.testnet',
  receiver_id: 'pinkinice.testnet',
  token_name: 'NEAR',
  timestamp_created: '1630964802206727665',
  balance: '3472735225910300000000000',
  tokens_per_tick: '100000000000',
  auto_deposit_enabled: false,
  status: 'ACTIVE',
  tokens_total_withdrawn: '27264774089700000000000',
  available_to_withdraw: '3472735225910300000000000',
  history: [
    {
      actor: 'dev-1630964633889-96006156236045',
      action_type: 'Deposit',
      amount: '3500000000000000000000000',
      timestamp: '1630964802206727665',
    },
  ],
};

export function StreamPage() {
  const near = useNear();
  const params = useParams();

  const accountSWR = useAccount({near});
  const streamSWR = useSingleStream(
    {streamId: params.id},
    {
      near,
      accountSWR,
    },
  );
  const PAGE_SIZE = 10;

  const {
    swr: streamHistorySWR,
    nextPage,
    prevPage,
    maxPage,
    currentPage,
  } = useSingleStreamHistory(
    {pageSize: 10},
    {
      near,
      accountSWR,
      streamSWR,
    },
  );

  const account = accountSWR.data;
  const stream = streamSWR.data;
  let streamHistory = streamHistorySWR.data || [];

  const pageError = streamSWR.error || accountSWR.error;
  const pageReady = stream && account;

  if (pageError) {
    return (
      <PageError
        className="twind-max-w-2xl twind-mx-auto twind-py-32"
        message={pageError.message}
        onRetry={() => {
          accountSWR.mutate();
          streamSWR.mutate();
        }}
      />
    );
  }

  const renderStreamData = () => {
    const {link} = streamViewData(stream);
    return (
      <>
        <div className="twind-flex twind-flex-col lg:twind-flex-row twind-justify-between">
          <div className="twind-flex twind-flex-col twind-items-center twind-flex-grow">
            <StreamDashboard stream={stream} account={account} />
            <StreamCopyUrlBlock
              link={link}
              className="twind-max-w-xl twind-w-full twind-mt-28"
            />
          </div>
          <StreamOverviewCard
            className="twind-mt-10 twind-w-full lg:twind-mt-0 lg:twind-w-1/3 twind-self-start"
            stream={stream}
            account={account}
          />
        </div>
        <StreamActionHistory
          pageSize={PAGE_SIZE}
          loading={!streamHistorySWR.data}
          stream={stream}
          history={streamHistory}
          className="twind-mx-auto twind-max-w-6xl twind-my-24 twind-w-full"
          onPrevPageClick={prevPage}
          onNextPageClick={nextPage}
          maxPage={maxPage}
          currentPage={currentPage}
        />
      </>
    );
  };

  return (
    <div className="twind-container twind-mx-auto twind-p-12">
      <div className="twind-mb-10">
        <BackButton to={routes.myStreams} />
      </div>
      {!pageReady ? (
        <div className="twind-py-32 twind-text-center twind-text-gray twind-text-2xl">
          Loading...
        </div>
      ) : (
        renderStreamData()
      )}
    </div>
  );
}
