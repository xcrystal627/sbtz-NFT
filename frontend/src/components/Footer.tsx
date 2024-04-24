import React from "react";
import "../app/globals.css";

export function Footer() {
  return (
    <footer>
      <div className="border-t">
        <div className="ft_outline">
          <p className="ft_title">SBTZ</p>
          <div className="ft_contents">
            <a
              href="https://autumn-neem-1a7.notion.site/How-to-get-started-SBTZ-207a50b8c8674c719162831630c48d25"
              target="_blank"
              rel="noreferrer"
            >
              <p className="ft_rap_items">Guide</p>
            </a>

            <a
              href="https://www.notion.so/SBTZ-Guide-f5509e267e6f4ded834af5c894eaf133"
              target="_blank"
              rel="noreferrer"
            >
              <p className="ft_rap_items">Terms</p>
            </a>

            <a
              href="https://autumn-neem-1a7.notion.site/Privacy-Policy-05dfff97004543e1a1a5a6bb60d10635"
              target="_blank"
              rel="noreferrer"
            >
              <p className="ft_rap_items">Privacy</p>
            </a>
            <a
              href="https://autumn-neem-1a7.notion.site/Contact-1052e10fbf7d4db49a365b9da70a76dd"
              target="_blank"
              rel="noreferrer"
            >
              <p className="ft_rap_items">Contact</p>
            </a>
            <a href="https://sbtz.app/plan" rel="noreferrer">
              <p className="ft_rap_items">Plan</p>
            </a>
            <a
              href="https://autumn-neem-1a7.notion.site/law-b1c0cf98a4974a4e9b330e405134bd3d"
              target="_blank"
              rel="noreferrer"
            >
              <p className="ft_rap_items">Law</p>
            </a>
            <a
              href="https://twitter.com/sbtzapp"
              target="_blank"
              rel="noreferrer"
            >
              <p className="ft_rap_items">X</p>
            </a>
          </div>
          <div className="ft_rap_company">
            <p className="ft_c">©</p>
            <p className="ft_year">{new Date().getFullYear()} WEA Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
