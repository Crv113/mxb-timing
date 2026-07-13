import React from 'react';
import Button from "./Button";

const LapTimeCategoryFilter = ({ categories, selectedCategoryId, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-2 my-4">
            <Button
                color={selectedCategoryId === null ? "primary" : "secondary"}
                onClick={() => onSelect(null)}
            >
                Overall
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    color={selectedCategoryId === category.id ? "primary" : "secondary"}
                    onClick={() => onSelect(category.id)}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
};

export default LapTimeCategoryFilter;
