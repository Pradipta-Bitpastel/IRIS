'use client';
import React, { useEffect, useRef, useState } from "react";
import { DropdownProps } from "../types/type";
import { json } from "stream/consumers";
import { interpretPercentage } from "../helpers";

const Dropdown: React.FC<DropdownProps> = ({
    label,
    options,
    selected,
    onChange,
    errors
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: any) => {
        if (label === 'Country') {
            onChange(JSON.stringify(option));
        } else {
            onChange(option);
        }
        setIsOpen(false);
    };

    // function interpretPercentage(input) {
    //     if (/^[<>]/.test(input)) {
    //         return `${input.startsWith("<") ? "Less than" : "Greater than"} ${input.slice(1)}`;
    //     }
    //     return input; // Return the input unchanged if it doesn't include < or >
    // }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="dropdown" ref={dropdownRef}>
            <label className="dropdown-label">
                {
                    label === 'Classification' ?
                        (
                            <svg className='inputlabel-svg' width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M7.75 3.25C7.75 2.65666 7.92595 2.07664 8.25559 1.58329C8.58524 1.08994 9.05377 0.705426 9.60195 0.478363C10.1501 0.2513 10.7533 0.19189 11.3353 0.307646C11.9172 0.423401 12.4518 0.709123 12.8713 1.12868C13.2909 1.54824 13.5766 2.08279 13.6924 2.66473C13.8081 3.24667 13.7487 3.84987 13.5216 4.39805C13.2946 4.94623 12.9101 5.41477 12.4167 5.74441C11.9234 6.07405 11.3433 6.25 10.75 6.25H8.5C8.30109 6.25 8.11032 6.17098 7.96967 6.03033C7.82902 5.88968 7.75 5.69891 7.75 5.5V3.25ZM0.25 3.25C0.25 2.45435 0.56607 1.69129 1.12868 1.12868C1.69129 0.566072 2.45435 0.250001 3.25 0.250001C4.04565 0.250001 4.80871 0.566072 5.37132 1.12868C5.93393 1.69129 6.25 2.45435 6.25 3.25V5.5C6.25 5.69891 6.17098 5.88968 6.03033 6.03033C5.88968 6.17098 5.69891 6.25 5.5 6.25H3.25C2.45435 6.25 1.69129 5.93393 1.12868 5.37132C0.56607 4.80871 0.25 4.04565 0.25 3.25ZM0.25 10.75C0.25 9.95435 0.56607 9.19129 1.12868 8.62868C1.69129 8.06607 2.45435 7.75 3.25 7.75H5.5C5.69891 7.75 5.88968 7.82902 6.03033 7.96967C6.17098 8.11032 6.25 8.30109 6.25 8.5V10.75C6.25 11.5457 5.93393 12.3087 5.37132 12.8713C4.80871 13.4339 4.04565 13.75 3.25 13.75C2.45435 13.75 1.69129 13.4339 1.12868 12.8713C0.56607 12.3087 0.25 11.5457 0.25 10.75ZM7.75 8.5C7.75 8.30109 7.82902 8.11032 7.96967 7.96967C8.11032 7.82902 8.30109 7.75 8.5 7.75H10.75C11.3433 7.75 11.9234 7.92595 12.4167 8.25559C12.9101 8.58524 13.2946 9.05377 13.5216 9.60195C13.7487 10.1501 13.8081 10.7533 13.6924 11.3353C13.5766 11.9172 13.2909 12.4518 12.8713 12.8713C12.4518 13.2909 11.9172 13.5766 11.3353 13.6924C10.7533 13.8081 10.1501 13.7487 9.60195 13.5216C9.05377 13.2946 8.58524 12.9101 8.25559 12.4167C7.92595 11.9234 7.75 11.3433 7.75 10.75V8.5Z" fill="#1391EA" />
                            </svg>
                        )
                        :
                        label === 'Country' ?
                            (
                                <svg className='inputlabel-svg' width={13} height={15} viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.50071 0.416748C3.37625 0.416748 0.834042 2.95896 0.834042 6.07987C0.8135 10.6451 6.28538 14.4304 6.50071 14.5834C6.50071 14.5834 12.1879 10.6451 12.1674 6.08342C12.1674 2.95896 9.62517 0.416748 6.50071 0.416748ZM6.50071 8.91675C4.93529 8.91675 3.66738 7.64883 3.66738 6.08342C3.66738 4.518 4.93529 3.25008 6.50071 3.25008C8.06612 3.25008 9.33404 4.518 9.33404 6.08342C9.33404 7.64883 8.06612 8.91675 6.50071 8.91675Z" fill="#1391EA" />
                                </svg>

                            )
                            :
                            label === 'Risk Score' ?
                                (
                                    <svg className='inputlabel-svg' width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.41151 0.655306C6.76826 0.613263 7.12772 0.707502 7.41795 0.919161C7.70818 1.13082 7.90777 1.44428 7.97676 1.79681L7.99551 1.92206L7.99926 2.00006V7.25006C7.99929 7.43376 8.06673 7.61106 8.1888 7.74833C8.31087 7.88561 8.47907 7.97331 8.66151 7.99481L8.74926 8.00006H13.8493C14.2471 8.00006 14.6286 8.15809 14.9099 8.4394C15.1912 8.7207 15.3493 9.10223 15.3493 9.50006C15.3492 9.55711 15.3427 9.61398 15.3298 9.66956C15.0296 10.9646 14.3907 12.1565 13.4784 13.1234C12.5661 14.0902 11.4132 14.7972 10.1378 15.172C8.86236 15.5467 7.51027 15.5757 6.21995 15.2561C4.92963 14.9364 3.74746 14.2796 2.79449 13.3528C1.84152 12.426 1.152 11.2625 0.79654 9.98163C0.441082 8.70071 0.432459 7.34833 0.771554 6.06299C1.11065 4.77764 1.78528 3.60552 2.72635 2.66664C3.66742 1.72777 4.84113 1.05589 6.12726 0.719806L6.32976 0.669556L6.41151 0.655306Z" fill="#1391EA" />
                                        <path d="M9.5 1.62506V5.75006C9.5 5.94897 9.57902 6.13973 9.71967 6.28039C9.86032 6.42104 10.0511 6.50006 10.25 6.50006H14.375C14.4949 6.50002 14.613 6.47125 14.7195 6.41616C14.8259 6.36107 14.9176 6.28126 14.9869 6.18342C15.0562 6.08557 15.101 5.97256 15.1176 5.85383C15.1342 5.73511 15.1221 5.61413 15.0823 5.50106C14.7098 4.44306 14.1047 3.48208 13.3116 2.68888C12.5186 1.89569 11.5577 1.29047 10.4998 0.917805C10.3866 0.877856 10.2656 0.865626 10.1467 0.882141C10.0279 0.898657 9.9148 0.943436 9.81686 1.01272C9.71892 1.082 9.63903 1.17377 9.5839 1.28032C9.52876 1.38687 9.49999 1.50509 9.5 1.62506Z" fill="#1391EA" />
                                    </svg>
                                )
                                :
                                label === 'Member Count' ?
                                    (
                                        <svg className='inputlabel-svg' width={10} height={13} viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.42147 10.6875C9.44676 10.9935 9.38651 11.3004 9.24745 11.5741C9.10839 11.8478 8.89599 12.0775 8.63397 12.2375C8.37272 12.3981 8.07147 12.4825 7.76522 12.4813H1.90709C1.60044 12.4826 1.29952 12.3982 1.03834 12.2375C0.775724 12.0785 0.563101 11.8488 0.42474 11.5748C0.286379 11.3007 0.227854 10.9932 0.255844 10.6875C0.278518 10.3824 0.386837 10.09 0.568344 9.84375C1.06666 9.18074 1.70848 8.63901 2.44576 8.25911C3.18305 7.87921 3.9967 7.67098 4.82584 7.65C5.65783 7.66652 6.47517 7.87204 7.21602 8.25102C7.95687 8.63 8.60183 9.17251 9.10209 9.8375C9.28399 10.0864 9.39485 10.3804 9.42147 10.6875ZM7.90272 3.575C7.90107 4.38751 7.57792 5.16635 7.00385 5.74135C6.42978 6.31636 5.65148 6.64078 4.83897 6.64375C4.38658 6.64264 3.94005 6.54137 3.53143 6.34722C3.12282 6.15308 2.76226 5.87087 2.47564 5.52086C2.18902 5.17085 1.98346 4.76171 1.8737 4.32284C1.76395 3.88396 1.75273 3.42623 1.84084 2.9825C1.92933 2.53867 2.11509 2.11996 2.38476 1.7565C2.65442 1.39304 3.00129 1.09387 3.40041 0.880505C3.79953 0.667139 4.24098 0.544885 4.693 0.522536C5.14502 0.500186 5.59637 0.578299 6.01459 0.751253C6.57391 0.982182 7.05228 1.37363 7.38932 1.87619C7.72636 2.37875 7.90697 2.96989 7.90834 3.575H7.90272Z" fill="#1391EA" />
                                        </svg>
                                    )
                                    :
                                    ''
                }
                {label}
            </label>
            <div className={`dropdown-header ${selected ? "active" : ""} ${errors.general ? "error" : ""}`} onClick={toggleDropdown}>
                {selected ? interpretPercentage(selected) : `Select ${label}`}
                <span className={`arrow ${isOpen ? "open" : ""}`}>
                    <svg width={9} height={6} viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.71875 0.662399H0.2812L4.49998 5.23755L8.71875 0.662399Z" fill="#8E9DAD" fillOpacity="0.5" />
                    </svg>
                </span>
            </div>
            {isOpen && (
                label === 'Classification' ?
                    <ul className="dropdown-list">
                        {options.map((option: any, index) => (
                            <li
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                    :
                    label === 'Risk Score' || label === 'Member Count' ? (
                        <ul className="dropdown-list">
                            {options.map((option: any, index) => (
                                <li
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleOptionClick(option.value)}
                                >
                                    {option.range}
                                </li>
                            ))}
                        </ul>
                    )
                        :
                        (
                            <ul className="dropdown-list">
                                {options.map((option: any, index) => (
                                    <li
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() => handleOptionClick({ id: option.id, name: option.name })}
                                    >
                                        <span className="inner_card_country_svg me-2" style={{ 'lineHeight': '0' }}>
                                            <img src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${option?.alpha2_code}.svg`} className="img-fluid"></img>
                                        </span>
                                        {option.name}
                                    </li>
                                ))}
                            </ul>
                        )
            )}
        </div>
    );
};

export default Dropdown;
