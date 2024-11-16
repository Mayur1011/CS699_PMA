import { Dialog, DialogTitle, DialogDescription } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";
import Loading from "./Loader";
import Textbox from "./Textbox";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleOnSubmit = async (data) => {
    if (data.password !== data.cpass) {
      toast.warning("Passwords do not match");
      return;
    }
    try {
      const result = await changePassword(data).unwrap();
      toast.success("Password changed successfully");

      setTimeout(() => {
        setOpen(false);
      }, 100);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <DialogTitle
            as="h2"
            className="font-bold text-base leading-6 text-gray-900 mb-4"
          >
            Change Password
          </DialogTitle>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              label="New Password"
              type="password"
              name="Password"
              placeholder="Enter your new password"
              className="w-full rounded"
              register={register("password", {
                required: "New password is required",
              })}
              error={errors.password ? errors.password.message : ""}
            />

            <Textbox
              label="Confirm New Password"
              type="password"
              name="cpass"
              placeholder="Confirm your new password"
              className="w-full rounded"
              register={register("cpass", {
                required: "Confirm new password is required",
              })}
              error={errors.cpass ? errors.cpass.message : ""}
            />
          </div>

          {isLoading ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-purple-600 px-8 text-sm font-semibold text-white hover:bg-purple-500"
                label="Save"
              />

              <button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto border"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default ChangePassword;
