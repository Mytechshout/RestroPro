import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "../../components/Page";
import {
  savePrintSettings,
  usePrintSettings,
} from "../../controllers/settings.controller";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import Popover from "../../components/Popover";
import { use } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { IconBluetooth, IconPrinter } from "@tabler/icons-react";
import {
  connectAndTestBluetoothPrinter,
  getPrinterMode,
  isBluetoothPrinterSupported,
  setPrinterMode,
} from "../../helpers/BluetoothPrinter";

export default function PrintSettingsPage() {
  const { t } = useTranslation();
  const enablePrintRef = useRef();
  const showStoreDetailsRef = useRef();
  const showCustomerDetailsRef = useRef();
  const pageSizeRef = useRef();
  const headerRef = useRef();
  const footerRef = useRef();
  const showNotesRef = useRef();
  const printTokenRef = useRef();
  const [printerMode, setCurrentPrinterMode] = useState(getPrinterMode);
  const [isTestingPrinter, setIsTestingPrinter] = useState(false);
  const { theme } = useTheme();

  const { APIURL, data, error, isLoading } = usePrintSettings();

  if (isLoading) {
    return <Page className="px-8 py-6">{t('print_settings.please_wait')}</Page>;
  }

  if (error) {
    console.error(error);
    return <Page className="px-8 py-6">{t('print_settings.error_loading_data')}</Page>;
  }

  const {
    pageFormat,
    header,
    footer,
    showNotes,
    isEnablePrint,
    showStoreDetails,
    showCustomerDetails,
    printToken,
  } = data;

  const btnSave = async () => {
    const enablePrint = enablePrintRef.current.checked;
    const showStoreDetails = showStoreDetailsRef.current.checked;
    const showCustomerDetails = showCustomerDetailsRef.current.checked;
    const pageSize = pageSizeRef.current.value;
    const header = headerRef.current.value;
    const footer = footerRef.current.value;
    const showNotes = showNotesRef.current.checked;
    const printToken = printTokenRef.current.checked;
    const savedPrinterMode = pageSize === "A4" ? "system" : printerMode;
    setPrinterMode(savedPrinterMode);
    setCurrentPrinterMode(savedPrinterMode);

    try {

      toast.loading(t('print_settings.please_wait'));
      const res = await savePrintSettings(pageSize, header, footer, showNotes, enablePrint, showStoreDetails, showCustomerDetails, printToken);

      if(res.status == 200) {
        await mutate(APIURL);
        toast.dismiss();
        toast.success(res.data.message);
      }
      
    } catch (error) {
      const message = error?.response?.data?.message || t('print_settings.something_went_wrong');
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  };

  const btnConnectAndTestPrinter = async () => {
    try {
      if (String(pageSizeRef.current?.value).toUpperCase() === "A4") {
        toast.error("A4 printing uses the System print dialog. Select 57mm or 80mm for a Bluetooth thermal printer.");
        return;
      }
      setIsTestingPrinter(true);
      await connectAndTestBluetoothPrinter(pageSizeRef.current?.value || pageFormat || 80);
      setCurrentPrinterMode("bluetooth");
      setPrinterMode("bluetooth");
      toast.success("Bluetooth printer connected. Test receipt sent.");
    } catch (error) {
      if (error?.name !== "NotFoundError") {
        toast.error(error?.message || "Unable to connect to the Bluetooth printer.");
      }
    } finally {
      setIsTestingPrinter(false);
    }
  };

  return (
    <Page className="px-8 py-6">
      <h3 className="text-3xl font-light">{t('print_settings.title')}</h3>

      <div className="mt-8 text-gray-500 text-sm">
        <div className="w-full lg:min-w-96 flex items-center justify-between">
          <label htmlFor="enablePrint" className="flex items-center gap-2">
            {t('print_settings.enable_print')}
            <Popover text={t('print_settings.enable_print_tooltip')} />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={enablePrintRef}
              defaultChecked={isEnablePrint}
              type="checkbox"
              name="enablePrint"
              id="enablePrint"
              value=""
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-100 after:border-restro-bg-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-restro-checkbox peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-restro-ring-light peer-checked:bg-restro-green peer-checked:after:border-restro-border-green`}></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-4 w-full lg:min-w-96 flex items-center justify-between">
          <label htmlFor="showStoreDetails" className="flex items-center gap-2">
            {t('print_settings.show_store_details')}
            <Popover text={t('print_settings.show_store_details_tooltip')} />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={showStoreDetailsRef}
              defaultChecked={showStoreDetails}
              type="checkbox"
              value=""
              name="showStoreDetails"
              id="showStoreDetails"
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-100 after:border-restro-bg-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-restro-checkbox peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-restro-ring-light peer-checked:bg-restro-green peer-checked:after:border-restro-border-green`}></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-4 w-full lg:min-w-96 flex items-center justify-between">
          <label
            htmlFor="showCustomerDetails"
            className="flex items-center gap-2"
          >
            {t('print_settings.show_customer_details')}
            <Popover text={t('print_settings.show_customer_details_tooltip')} />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={showCustomerDetailsRef}
              defaultChecked={showCustomerDetails}
              type="checkbox"
              value=""
              name="showCustomerDetails"
              id="showCustomerDetails"
              className="sr-only peer"
            />
           <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-100 after:border-restro-bg-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-restro-checkbox peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-restro-ring-light peer-checked:bg-restro-green peer-checked:after:border-restro-border-green`}></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-4 w-full lg:min-w-96">
          <label htmlFor="pageSize" className="block mb-1">
            {t('print_settings.format_page_size')}
          </label>
          <select
            ref={pageSizeRef}
            defaultValue={pageFormat}
            onChange={(event) => {
              if (event.target.value === "A4" && printerMode === "bluetooth") {
                setPrinterMode("system");
                setCurrentPrinterMode("system");
                toast.success("Printer mode changed to System print dialog for A4 paper.");
              }
            }}
            name="pageSize"
            id="pageSize"
            className='block w-full lg:min-w-96 rounded-lg px-4 py-2 text-restro-text bg-restro-gray border border-restro-border-green focus:outline-restro-button-hover'
          >
            <option hidden value="">
              {t('print_settings.select_page_size')}
            </option>
            <option value="80">80mm</option>
            <option value="57">57mm</option>
            <option value="A4">A4 (210 x 297mm)</option>
          </select>
        </div>

        <div className="mt-4">
          <label htmlFor="header" className="block mb-1">
            {t('print_settings.header')}
          </label>
          <textarea
            ref={headerRef}
            defaultValue={header}
            type="text"
            name="header"
            id="header"
            placeholder={t('print_settings.header_placeholder')}
            className='block w-full h-20 lg:min-w-96 rounded-lg px-4 py-2 text-restro-text bg-restro-gray border border-restro-border-green focus:outline-restro-button-hover'
          />
        </div>

        <div className="mt-4">
          <label htmlFor="footer" className="block mb-1">
            {t('print_settings.footer')}
          </label>
          <textarea
            ref={footerRef}
            defaultValue={footer}
            type="text"
            name="footer"
            id="footer"
            placeholder={t('print_settings.footer_placeholder')}
           className='block w-full h-20 lg:min-w-96 rounded-lg px-4 py-2 text-restro-text bg-restro-gray border border-restro-border-green focus:outline-restro-button-hover'
          />
        </div>

        <div className="mt-4 w-full lg:min-w-96 flex items-center justify-between">
          <label htmlFor="showNotes" className="flex items-center gap-2">
            {t('print_settings.show_notes')}
            <Popover text={t('print_settings.show_notes_tooltip')} />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={showNotesRef}
              defaultChecked={showNotes}
              type="checkbox"
              value=""
              name="showNotes"
              id="showNotes"
              className="sr-only peer"
            />
           <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-100 after:border-restro-bg-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-restro-checkbox peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-restro-ring-light peer-checked:bg-restro-green peer-checked:after:border-restro-border-green`}></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-4 w-full lg:min-w-96 flex items-center justify-between">
          <label htmlFor="printToken" className="flex items-center gap-2">
            {t('print_settings.print_token')}
            <Popover text={t('print_settings.print_token_tooltip')} />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={printTokenRef}
              defaultChecked={printToken}
              type="checkbox"
              value=""
              name="printToken"
              id="printToken"
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-100 after:border-restro-bg-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-restro-checkbox peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-restro-ring-light peer-checked:bg-restro-green peer-checked:after:border-restro-border-green`}></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-6 rounded-2xl border border-restro-border-green p-4 lg:min-w-96">
          <div className="flex items-center gap-2 font-semibold text-restro-text">
            {printerMode === "bluetooth" ? <IconBluetooth size={20} /> : <IconPrinter size={20} />}
            Printer connection
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Bluetooth mode sends ESC/POS receipts directly to a paired Bluetooth thermal printer. System mode opens the normal browser print dialog.
          </p>
          <p className="mt-2 text-xs text-restro-green">
            Use System print for A4 paper. Bluetooth mode is intended for 57mm or 80mm thermal receipt printers.
          </p>
          <select
            value={printerMode}
            onChange={(event) => {
              const mode = setPrinterMode(event.target.value);
              setCurrentPrinterMode(mode);
            }}
            className="mt-3 block w-full rounded-lg border border-restro-border-green bg-restro-gray px-4 py-2 text-restro-text focus:outline-restro-button-hover"
          >
            <option value="system">System print dialog</option>
            <option value="bluetooth">Bluetooth thermal printer</option>
          </select>

          {printerMode === "bluetooth" && (
            <div className="mt-3">
              <button
                type="button"
                disabled={isTestingPrinter || !isBluetoothPrinterSupported()}
                onClick={btnConnectAndTestPrinter}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-restro-green px-4 py-2 text-white transition hover:bg-restro-green-button-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconBluetooth size={18} />
                {isTestingPrinter ? "Connecting..." : "Connect and print test"}
              </button>
              {!isBluetoothPrinterSupported() && (
                <p className="mt-2 text-xs text-red-500">
                  Direct Bluetooth printing is not supported in this browser. Use the latest Chrome or select System print dialog.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={btnSave}
          className='text-white w-full lg:min-w-96 transition  active:scale-95 rounded-xl px-4 py-2 mt-6 bg-restro-green hover:bg-restro-green-button-hover '
        >
          {t('print_settings.save')}
        </button>
      </div>
    </Page>
  );
}
