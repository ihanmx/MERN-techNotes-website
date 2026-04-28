import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faLocationDot,
  faPhone,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { Logo, Button, Card, Badge } from "../ui";

const Public = () => (
  <section className="flex-1 flex flex-col">
    {/* Top bar */}
    <header className="border-b border-white/10 bg-surface-1/60 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Logo size={36} />
        <Link to="/login">
          <Button
            variant="primary"
            size="sm"
            rightIcon={<FontAwesomeIcon icon={faRightToBracket} />}
          >
            Employee Login
          </Button>
        </Link>
      </div>
    </header>

    {/* Hero */}
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <Badge tone="secondary" dot className="mb-5">
            Trusted Tech Repair
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Welcome to{" "}
            <span className="bg-linear-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent whitespace-nowrap">
              Dan D. Repairs
            </span>
          </h1>
          <p className="mt-5 text-lg text-ink-300 max-w-xl">
            Located in Beautiful Downtown Foo City, Dan D. Repairs provides a
            trained staff ready to meet your tech repair needs.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/login">
              <Button
                size="lg"
                rightIcon={<FontAwesomeIcon icon={faRightToBracket} />}
              >
                Employee Login
              </Button>
            </Link>
            <a href="tel:+15555555555">
              <Button
                size="lg"
                variant="ghost"
                leftIcon={<FontAwesomeIcon icon={faPhone} />}
              >
                Call us
              </Button>
            </a>
          </div>
        </div>

        <Card className="lg:justify-self-end w-full max-w-md">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300 text-xl">
              <FontAwesomeIcon icon={faWrench} />
            </span>
            <div>
              <h3 className="text-xl font-bold text-ink-100">Visit our shop</h3>
              <p className="text-sm text-ink-400 mt-1">
                We're open weekdays, 9am — 6pm.
              </p>
            </div>
          </div>

          <address className="mt-6 not-italic space-y-3 text-ink-200">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-secondary-400 mt-1"
              />
              <div>
                <div className="font-semibold text-ink-100">Dan D. Repairs</div>
                <div className="text-sm text-ink-400">
                  555 Foo Drive
                  <br />
                  Foo City, CA 12345
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faPhone} className="text-secondary-400" />
              <a
                href="tel:+15555555555"
                className="font-semibold text-ink-100 hover:text-secondary-300 transition-colors"
              >
                (555) 555-5555
              </a>
            </div>
          </address>

          <div className="mt-6 pt-5 border-t border-white/10 text-sm text-ink-400">
            Owner:{" "}
            <span className="font-semibold text-ink-200">Dan Davidson</span>
          </div>
        </Card>
      </div>
    </main>

    <footer className="border-t border-white/10 py-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between text-sm text-ink-500">
        <span>© {new Date().getFullYear()} techNotes</span>
        <Link
          to="/login"
          className="text-ink-300 hover:text-white transition-colors"
        >
          Employee Login →
        </Link>
      </div>
    </footer>
  </section>
);

export default Public;