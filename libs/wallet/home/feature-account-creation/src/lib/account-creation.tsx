import { Button } from "@multiverse-wallet/shared/components/button";
import { useWalletState } from "@multiverse-wallet/wallet/hooks";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { CreateAccountForm } from "./create-account-form";
import { ImportAccountForm } from "./import-account-form";

export function AccountCreation() {
  const { api } = useWalletState();
  const navigate = useNavigate();
  async function onNewAccountData(
    secretRecoveryPhrase: string,
    password: string
  ) {
    await api.setupRecoveryPhrase({ password, secretRecoveryPhrase });
    navigate("/");
  }

  return (
    <div>
      <header className="pt-16 flex justify-center items-center">
        <img src="/assets/logo.svg" alt="" height={200} width={200} />
      </header>
      <main className="py-12 px-8">
        <Routes>
          <Route
            path="/new"
            element={<CreateAccountForm onNewAccountData={onNewAccountData} />}
          />
          <Route path="/import-existing" element={<ImportAccountForm />} />
          {/* Root matcher must come last */}
          <Route
            path="/*"
            element={
              <div className="max-w-5xl m-auto">
                <h1
                  className="text-5xl font-extrabold leading-tight text-center"
                  data-cy="welcome-title"
                >
                  Welcome to Multiverse
                </h1>
                <p className="mt-4 text-md text-center">
                  Everything you do here is running privately on your computer,
                  nothing is ever sent to our servers. It's important to
                  understand that this also means{" "}
                  <span className="font-bold">
                    we cannot help you recover any of the secure data
                  </span>{" "}
                  you create and use within this context.{" "}
                  <span className="highlight">
                    Please read all the instructions carefully!
                  </span>
                </p>
                <div className="max-w-4xl mx-auto mt-8">
                  <div className="relative">
                    <div className="max-w-md mx-auto space-y-4 lg:max-w-5xl lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
                      <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-8 pb-0 bg-white">
                          <div className="mt-4 flex items-baseline text-4xl leading-none font-extrabold justify-center">
                            Create Account
                          </div>
                          <p className="mt-5 text-md justify leading-7">
                            This will create a new account and secret recovery
                            phrase on this device.
                          </p>
                        </div>
                        <div className="flex-1 flex flex-col justify-between pt-0 p-6 space-y-6 sm:p-10">
                          <Link to="/create/new">
                            <Button variant="primary" className="w-full">
                              Create Account
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-8 pb-0 bg-white">
                          <div className="mt-4 flex items-baseline text-4xl leading-none font-extrabold justify-center">
                            Import Existing
                          </div>
                          <p className="mt-5 text-md leading-7">
                            Use an existing secret recovery phrase to import
                            account data.
                          </p>
                        </div>
                        <div className="flex-1 flex flex-col justify-between p-6 space-y-6 sm:p-10">
                          <Link to="/create/import-existing">
                            <Button variant="dark" className="w-full">
                              Import Data
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
