import { Header } from "@/components/Header";
import { BlackFooter } from "@/components/BlackFooter";

import React from "react";
import Link from "next/link";
import Script from "next/script";
import "./Home.css";
import Plan from "@/components/Plan/Plan";
// import Layout from "../components/Layout";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="mv">
          <div className="mv-left">
            <p className="mv-left__text">
              SBTZ is a platform of <br />
              the new era that is sustainable <br />
              and true.
            </p>
            <div className="mv-left__btn">
              <Link href="/registration">Register your community</Link>
            </div>
          </div>
          <div className="mv-center">
            <img
              className="mv-center__img pc"
              src="/top-main.png"
              width={560}
              height={1286}
              alt=""
            />
            <img
              className="mv-center__img sp"
              src="/top-main_sp.png"
              width={568}
              height={1648}
              alt=""
            />
          </div>
          <div className="mv-right">
            <img
              className="mv-right__img pc"
              src="/top-right.png"
              width={560}
              height={1066}
              alt=""
            />
            <img
              className="mv-right__img sp"
              src="/top-right_sp.png"
              width={560}
              height={1066}
              alt=""
            />
          </div>
        </section>
        <section className="what">
          <div className="what-box">
            <h1 className="what-box__title">
              This platform certifies your <br className="pc" />
              achievements and talent.
            </h1>
            <p className="what-box__text">
              SBTZ certifies a person’s work achievements with SBT, and there by
              proves them as authentic, reliable, and transparent record.
            </p>
          </div>
          <div className="what-flow_wrapper">
            <div className="what-flow">
              <div className="what-flow__box what-flow__box--left">
                <p>Community leader</p>
                <img
                  src="/what-flow_leader.png"
                  width={200}
                  height={240}
                  alt=""
                />
                <ul>
                  <li>
                    <img
                      src="/what-flow_box-icon01.png"
                      width={60}
                      height={60}
                      alt=""
                    />
                    <p>
                      Make <br />
                      community
                    </p>
                  </li>
                  <li>
                    <img
                      src="/what-flow_box-icon02.png"
                      width={60}
                      height={60}
                      alt=""
                    />
                    <p>Start Project</p>
                  </li>
                  <li>
                    <img
                      src="/what-flow_box-icon03.png"
                      width={60}
                      height={60}
                      alt=""
                    />
                    <p>
                      Give SBT &amp;
                      <br /> appreciation <br />
                      to members
                    </p>
                  </li>
                  <li>
                    <img
                      src="/what-flow_box-icon04.png"
                      width={60}
                      height={60}
                      alt=""
                    />
                    <p>
                      Search <br />
                      community <br />
                      &amp; person
                    </p>
                  </li>
                </ul>
              </div>
              <div className="what-flow__box what-flow__box--desc _01">
                <p className="arrow-green">
                  Give member <br />
                  Appreciation <br />
                  &amp; SBT
                </p>
                <p className="arrow-black">Contribution</p>
              </div>
              <div className="what-flow__box what-flow__box--center">
                <div className="member">
                  <p>Member</p>
                  <img
                    src="/what-flow_member.png"
                    width={280}
                    height={280}
                    alt=""
                  />
                </div>
                <div className="receive">
                  <p>receive</p>
                  <img
                    src="/what-flow-member_receive.png"
                    width={380}
                    height={280}
                    className="pc"
                    alt=""
                  />
                  <img
                    src="/what-flow-member_img.png"
                    width={380}
                    height={280}
                    className="sp"
                    alt=""
                  />
                </div>
              </div>
              <div className="what-flow__box what-flow__box--desc _02">
                <p className="arrow-green _reversal">
                  Invest on <br />
                  community <br />
                  &amp;member
                </p>
              </div>
              <div className="what-flow__box what-flow__box--right">
                <p>Invester</p>
                <img
                  src="/what-flow_invester.png"
                  width={200}
                  height={240}
                  alt=""
                />
                <ul>
                  <li>
                    <img
                      src="/what-flow_box-icon05.png"
                      width={60}
                      height={60}
                      alt=""
                    />
                    <p>
                      See <br />
                      community <br />& member
                    </p>
                  </li>
                  <li>
                    <img
                      src="/what-flow_box-icon06.png"
                      width={60}
                      height={60}
                      alt=""
                    />
                    <p>See user SBT</p>
                  </li>
                  <li>
                    <img
                      src="/what-flow_box-icon07.png"
                      width={60}
                      height={60}
                      alt=""
                    />
                    <p>
                      Recruitment <br />
                      member or
                      <br />
                      leader
                    </p>
                  </li>
                  <li>
                    <img
                      src="/what-flow_box-icon08.png"
                      width={60}
                      height={60}
                      alt=""
                    />
                    <p>
                      Get real <br />
                      information
                      <br />
                      of member
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="about">
          <div className="about-box">
            <h1 className="about-box__title">
              Change the works done
              <br />
              in your community into SBT.
            </h1>
            <p className="about-box__text">
              SBTZ collects and changes the works achieved by you and your
              colleagues into SBT and builds your accounts (yours and your
              colleagues’) by sending the generated SBT to each other.
              Evaluation, recognition, and appreciation of and to each other and
              the continuation of such will grow your accounts.
            </p>
          </div>
          <ul className="about-list">
            <li className="about-list__item">
              <p>
                <span>PROJECT</span>
              </p>
              <img
                src="/about_item-img01.jpg"
                width={200}
                height={260}
                alt=""
              />
              <p>
                <span>COMPLETE</span>
              </p>
              <div>Project milestone</div>
            </li>
            <li className="about-list__item">
              <p>
                <span>BRAND</span>
              </p>
              <img
                src="/about_item-img02.jpg"
                width={200}
                height={260}
                alt=""
              />
              <p>
                <span>CO-PR</span>
              </p>
              <div>joint development</div>
            </li>
            <li className="about-list__item">
              <p>
                <span>SKILLS</span>
              </p>
              <img
                src="/about_item-img03.jpg"
                width={280}
                height={200}
                className="pc"
                alt=""
              />
              <img
                src="/about_item-img06.jpg"
                width={200}
                height={260}
                className="sp"
                alt=""
              />
              <p>
                <span>ABILITIES</span>
              </p>
              <div>Talent</div>
            </li>
            <li className="about-list__item">
              <p>
                <span>AWARD</span>
              </p>
              <img
                src="/about_item-img04.jpg"
                width={200}
                height={260}
                alt=""
              />
              <p>
                <span>AWARD</span>
              </p>
              <div>Winning Awards</div>
            </li>
            <li className="about-list__item">
              <p>
                <span>ROLE</span>
              </p>
              <img
                src="/about_item-img05.jpg"
                width={200}
                height={260}
                alt=""
              />
              <p>
                <span>ROLE</span>
              </p>
              <div>Position</div>
            </li>
          </ul>
        </section>
        <section className="howto">
          <div className="howto-box">
            <h1 className="howto-box__title">
              How to get started
              <br />
              with SBTZ
            </h1>
            <p className="howto-box__text">
              <span>Standard</span>
              Generation, presentation, receival, and management of SBT can be
              done using a standardized procedure.
            </p>
          </div>
          <div className="howto-flow">
            <div className="howto-flow__box">
              <div>START</div>
              <img src="/howto_icon01.png" width={60} height={60} alt="" />
              <p>
                <span>Get a Wallet.</span>{" "}
                <a href="https://autumn-neem-1a7.notion.site/How-to-create-a-Meta-Mask-wallet-34762983cb6c4260aaa22491965c8459">
                  Need a help? Click here.
                </a>
              </p>
            </div>
            <ul className="howto-flow__list">
              <li>
                <figure>
                  <img src="/howto_icon02.png" width={60} height={60} alt="" />
                  <figcaption>
                    Register Your <br />
                    Community
                  </figcaption>
                </figure>
                <div>
                  <Link href="/registration">
                    <img
                      src="/howto_register.svg"
                      alt="Reister"
                      width={151}
                      height={70}
                      className="pc"
                    />
                    <img
                      src="/howto_register_sp.svg"
                      alt="Reister"
                      width={150}
                      height={60}
                      className="sp"
                    />
                  </Link>
                </div>
                <p>
                  Fill out the items listed on the registration page and
                  register your community (It will be screened before it is
                  accepted).
                </p>
              </li>
              <li>
                <figure>
                  <img src="/howto_icon03.png" width={60} height={60} alt="" />
                  <figcaption>Generate SBT</figcaption>
                </figure>
                <p>
                  Generate SBT on the designated community page (Can only be
                  done by the community administrator).
                </p>
              </li>
              <li>
                <figure>
                  <img src="/howto_icon04.png" width={60} height={60} alt="" />
                  <figcaption>
                    Send SBT To Your <br />
                    Community Members
                  </figcaption>
                </figure>
                <p>
                  Send SBT you Generated in Step 2 to the community members by
                  sending the designated URL.
                </p>
              </li>
              <li>
                <figure>
                  <img src="/howto_icon05.png" width={60} height={60} alt="" />
                  <figcaption>Check SBT Receiver</figcaption>
                </figure>
                <p>Log in to SBTZ to confirm the transaction.</p>
              </li>
            </ul>
          </div>
          <div className="howto-desc">
            <p>
              This platform can be integrated with AI and other services. For
              details, please check here.
            </p>
          </div>
        </section>
        <section className="bg-black -z-10">
          <Plan callBy="top" />
        </section>
      </main>

      <BlackFooter />
      <Script src="/common.js" strategy="afterInteractive" />
    </>
  );
}
