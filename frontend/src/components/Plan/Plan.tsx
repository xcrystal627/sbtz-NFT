import { Community as CommunityType } from "@/types";
import styles from "./Plan.module.css";
import React from "react";
import Image from "next/image";
import { planDescriptions } from "@/lib/constant";
import Link from "next/link";

type PlanProps = {
  callBy: string;
  community?: CommunityType;
  stripeCheckout?: () => void;
};

const Plan: React.FC<PlanProps> = ({ callBy, community, stripeCheckout }) => {
  return (
    <>
      <div className={styles.rap}>
        <p className={styles.mpTitle}>
          {callBy === "top" ? "Plan Guide" : "Manage Plan"}
        </p>
        <p className={styles.mpMsg}>
          フリープランはSBTを100個まで無料で発行および進呈ができます。
          <br />
          レギュラープランにアップグレードをすれば各種追加サービスを利用できます。
          <br />
          カスタマイズも可能です。
        </p>
      </div>
      <div className={styles.plansRap}>
        <div></div>
        {planDescriptions.map((plan, index) => (
          <div
            key={index}
            className={`${styles[`plan${index}`]} ${styles.planAll}`}
          >
            <Image
              src={`/mpBg${index}.svg`}
              alt="Description"
              layout="fill"
              objectFit="cover"
              style={{ zIndex: -1 }}
              className={styles.planIMGpc}
            />
            <Image
              src={`/mpBg${index}sp.svg`}
              alt="Description"
              layout="fill"
              objectFit="cover"
              style={{ zIndex: -1 }}
              className={styles.planIMGsp}
            />
            <div className={styles.pNameRow}>
              <p className={styles.pName}>{plan.planName}</p>
              {index == 1 ? <p className={styles.pop}>Popular</p> : null}
            </div>
            <div className={styles.priRow}>
              <p className={styles.pri}> {plan.price} </p>
              <div className={styles.perRap}>
                {plan.per.map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </div>
            <div className={styles.lineRap}>
              <img src={index === 1 ? "/mpLineWh.svg" : "/mpLine.svg"} alt="" />
            </div>
            <div className={`${styles.detRap} ${styles.fl_c}`}>
              {plan.detail.map((item, idx) => (
                <div
                  key={`detail-${idx}`}
                  className={`${styles.fl} ${styles.g_8} ${styles.al_c}`}
                >
                  <img src="/mpCKcircle.svg" alt="" />
                  <p key={idx}>{item}</p>
                </div>
              ))}
            </div>
            {callBy === "top" ? (
              <div className={styles.staRap}>
                {plan.planName === "Customization" && (
                  <Link href="contract" target="_blank">
                    <p className={`${styles[`sta${index}`]} ${styles.sta} `}>
                      Ask
                    </p>
                  </Link>
                )}
              </div>
            ) : (
              <div className={styles.staRap}>
                {plan.planName === "Customization" && (
                  <Link href="contract" target="_blank">
                    <p className={`${styles[`sta${index}`]} ${styles.sta} `}>
                      Ask
                    </p>
                  </Link>
                )}
                {plan.planName === "Regular" && (
                  <>
                    {community?.subscriptionStatus === "Premium" ? (
                      <p className={`${styles[`sta${index}`]} ${styles.sta} `}>
                        Current
                      </p>
                    ) : (
                      <p
                        className={`${styles[`sta${index}`]} ${styles.sta} `}
                        onClick={stripeCheckout}
                      >
                        Upgrade
                      </p>
                    )}
                  </>
                )}
                {plan.planName === "Free" && (
                  <>
                    {community?.subscriptionStatus === "Free" ? (
                      <p className={`${styles[`sta${index}`]} ${styles.sta} `}>
                        Current
                      </p>
                    ) : (
                      <p className={`${styles[`sta${index}`]} ${styles.sta} `}>
                        Downgrade
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
export default Plan;
