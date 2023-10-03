/** @format */

import { Dialog } from "@headlessui/react";
import { CSSProperties } from "react";
import { DotLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const Spinner = ({ loading }: { loading: boolean }) => {
  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-3xl z-40'
      open={loading}
      onClose={() => {}}>
      <DotLoader
        color='#36d7b7'
        loading={loading}
        cssOverride={override}
        size={100}
        aria-label='Loading Spinner'
      />
    </Dialog>
  );
};

export default Spinner;
