'use client';

import { accordionItems } from '@/data/accordionItemsSwapFuel';
import { checkNetwork } from '@/libs/NetworkLibrary';
import { Network } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import SwapToken1 from '../../../components/pages/home/SwapToken1';
import SwapToken2 from '../../../components/pages/home/SwapToken2';
import Accordion from '../../../components/ui/accordion/Accordion';
import PercentageSelector from './PercentageSelector';
import Image from 'next/image';
import SwapClick from '../../ui/modals/swap/swapclick';

type NetworkState = Network | null;

function Home() {
    const modalRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    const [network, setNetwork] = useState<NetworkState>(null);
    const [balance, _] = useState(31980); // مقدار ثابت بالانس اولیه
    const [selectedPercentage, setSelectedPercentage] = useState<number>(1); // درصد انتخاب شده (100% به صورت پیش‌فرض)
    const [isSwapped, setIsSwapped] = useState<boolean>(false);
    const [token1Data, setToken1Data] = useState<{
        balance: number;
        token_address: string;
    }>({ balance: 31980, token_address: 'token_list_modal_1' }); // مقدار اولیه بالانس
    const [token2Data, setToken2Data] = useState<{
        balance: number;
        token_address: string;
    }>({ balance: 0, token_address: 'token_list_modal_2' });


    const handlePercentageChange = (value: number) => {
        setSelectedPercentage(value);
        // محاسبه بالانس جدید بر اساس درصد
        const newBalance = balance * value;
        // تنظیم بالانس جدید در کامپوننت SwapToken1
        setToken1Data({ ...token1Data, balance: newBalance });
    };

    const handleTokenSelect = (data: {
        balance: number;
        token_address: string;
    }) => {
        if (data.token_address === 'token_list_modal_1') {
            setToken1Data(data);
        } else if (data.token_address === 'token_list_modal_2') {
            setToken2Data(data);
        }
    };

    const handleSwapClick = () => {
        setIsSwapped(!isSwapped);
    };

    useEffect(() => {
        async function fetchNetwork() {
            const networkData = (await checkNetwork()) as NetworkState;
            setNetwork(networkData);
        }

        fetchNetwork();
    }, []);

    return (
        <section className="min-h-screen rounded-[10px] px-6 py-2 ">
            <div className="flex flex-col  content-center items-baseline justify-center">
                <div className="mb-4 flex w-full flex-row items-center justify-between capitalize text-white">
                    <span className="font-sora text-base">swap</span>
                    <label htmlFor="swap_setting_modal" className="btn btn-square btn-ghost">
                        <Image
                            className="text-[#C6F0FF]"
                            loading="lazy"
                            priority={false}
                            src={'/assets/icons/swap_token.svg'}
                            width={20}
                            height={20}
                            alt="swap token icon"
                        />
                    </label>
                </div>
                <div className="flex w-full flex-col gap-[8px] items-stretch p-[12px] border-gradient">
                    <p className="lg:pl-4 pl-0 text-[12px] font-normal text-[#C6F0FF]">
                        Balance: 31980
                    </p>

                    <PercentageSelector onChange={handlePercentageChange} />

                    <div className="flex flex-row items-center justify-around">
                        {isSwapped ? (
                            <SwapToken2 data={token2Data} onSelectToken={handleTokenSelect} />
                        ) : (
                            <SwapToken1 data={token1Data} onSelectToken={handleTokenSelect} />
                        )}
                    </div>
                </div>

                <div className="py-[6px] self-center">
                    <button onClick={handleSwapClick} className="p-2">
                        <p className="bg-[#00CCF5] rounded-md p-2">
                            <Image
                                className=""
                                loading="lazy"
                                priority={false}
                                src={'/assets/icons/swap_down.svg'}
                                width={30}
                                height={40}
                                alt="dropdown icon"
                            />
                        </p>
                    </button>
                </div>

                <div className=" flex w-full flex-row items-center justify-between rounded-[10px] p-[12px] border-gradient">
                    {isSwapped ? (
                        <SwapToken1 data={token1Data} onSelectToken={handleTokenSelect} />
                    ) : (
                        <SwapToken2 data={token2Data} onSelectToken={handleTokenSelect} />
                    )}
                </div>

                <Accordion items={accordionItems} />

                <section onClick={openModal} className="mt-4 flex w-full flex-wrap items-center justify-center py-3   ">
                    <button className="btn btn-ghost w-full swap-gradient capitalize text-white md:w-full">
                        swap
                    </button>
                </section>
                <SwapClick modalRef={modalRef} />

            </div>
        </section>
    );
}

export default Home;
