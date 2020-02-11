<?php

// Created by Hamilton Cline
// https://github.com/bronkula/PHP_PRINT_O/blob/master/print_o.php

function print_o($o,$initial=true) {
    if($initial) {
        $o = (object)array("key"=>gettype($o),"val"=>$o);
    }
    if(gettype($o->val)=="object") {
        echo "<div>";
        if(!$initial) echo "<strong>{$o->key}</strong>: ";
        echo "{<div style='padding-left:1em;'>";
        foreach($o->val as $k=>$v) print_o((object)array("key"=>$k,"val"=>$v),false);
        echo "</div>";
        echo "}</div>";
    }
    elseif(gettype($o->val)=="array") {
        echo "<div>";
        if(!$initial) echo "<strong>{$o->key}</strong>: ";
        if(count($o->val)) {
            echo "[<div style='padding-left:1em;'>";
            foreach($o->val as $k=>$v) print_o((object)array("key"=>$k,"val"=>$v),false);
            echo "</div>]";
        } else {
            echo "[ 0 ]";
        }
        echo "</div>";
    }
    elseif(gettype($o->val)=="string") {
        echo "<div><strong>{$o->key}</strong>: <em style='color:green;'>\"{$o->val}\"</em></div>\n";
    } elseif(gettype($o->val)=="integer" || gettype($o->val)=="double" || gettype($o->val)=="float") {
        echo "<div><strong>{$o->key}</strong>: <span style='color:blue;'>{$o->val}</span></div>\n";
    } else {
        echo "<div><strong>{$o->key}</strong>: {$o->val} (".gettype($o->val).")</div>\n";
    }
}
